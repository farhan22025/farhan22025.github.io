import torch
import torch.nn as nn
import torch.optim as optim
import argparse
from pathlib import Path
import datetime
from transformers import AutoModelForSequenceClassification

from text_data_loader import get_text_dataloaders

def train_text(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training Text NLP Model on device: {device}")

    # Load data
    train_loader, val_loader = get_text_dataloaders(args.data_dir, batch_size=args.batch_size)

    # Load HuggingFace sequence classification model
    model = AutoModelForSequenceClassification.from_pretrained(
        args.model_name, 
        num_labels=2 # 0: Human, 1: AI
    ).to(device)

    # Loss and optimizer
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-2)

    # Learning rate scheduler
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=2, factor=0.5)

    best_val_loss = float('inf')
    start_epoch = 0
    epochs_no_improve = 0

    # Auto-resume logic
    model_save_path = Path("best_text_model.pth")
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file_path = logs_dir / f"text_training_log_{timestamp}.csv"

    if model_save_path.exists():
        checkpoint = torch.load(model_save_path, map_location=device, weights_only=True)
        last_epoch = checkpoint.get('epoch', 0)
        
        if last_epoch < args.epochs - 1:
            print(f"--> Found half-trained text model progress at epoch {last_epoch + 1}/{args.epochs}")
            while True:
                choice = input("Do you want to resume from this checkpoint? (y/n): ").strip().lower()
                if choice in ['y', 'yes', '']:
                    print(f"--> Resuming training from previous state...")
                    model.load_state_dict(checkpoint['model_state_dict'])
                    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
                    best_val_loss = checkpoint['val_loss']
                    start_epoch = last_epoch + 1
                    
                    if 'log_path' in checkpoint and Path(checkpoint['log_path']).exists():
                        log_file_path = Path(checkpoint['log_path'])
                    break
                elif choice in ['n', 'no']:
                    print(f"--> Starting training from scratch (new log generated).")
                    with open(log_file_path, "w") as f:
                        f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")
                    break
                else:
                    print("Invalid input.")
        else:
            print(f"--> Found fully trained text model (completed {last_epoch + 1} epochs). Starting new scratch training.")
            with open(log_file_path, "w") as f:
                f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")
    else:
        with open(log_file_path, "w") as f:
            f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")

    for epoch in range(start_epoch, args.epochs):
        model.train()
        train_loss = 0.0
        train_correct = 0

        for batch_idx, batch in enumerate(train_loader):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)

            optimizer.zero_grad()
            
            # Using standard precision for Huggingface text models to avoid autocast numerical instability on some GPUs
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            logits = outputs.logits
            
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * input_ids.size(0)
            preds = torch.argmax(logits, dim=1)
            train_correct += torch.sum(preds == labels.data)

            if batch_idx % 10 == 0:
                print(f"\rText Training Epoch {epoch+1}/{args.epochs} - Batch {batch_idx}/{len(train_loader)} - Loss: {loss.item():.4f}", end="", flush=True)
                
        print() 
        epoch_train_loss = train_loss / len(train_loader.dataset)
        epoch_train_acc = train_correct.double() / len(train_loader.dataset)

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0

        with torch.no_grad():
             for batch_idx, batch in enumerate(val_loader):
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['labels'].to(device)
                
                outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
                loss = outputs.loss
                logits = outputs.logits
                
                val_loss += loss.item() * input_ids.size(0)
                preds = torch.argmax(logits, dim=1)
                val_correct += torch.sum(preds == labels.data)

                if batch_idx % 10 == 0:
                    print(f"\rValidating Epoch {epoch+1}/{args.epochs} - Batch {batch_idx}/{len(val_loader)} - Loss: {loss.item():.4f}", end="", flush=True)

        print() 
        epoch_val_loss = val_loss / len(val_loader.dataset)
        epoch_val_acc = val_correct.double() / len(val_loader.dataset)

        with open(log_file_path, "a") as f:
            f.write(f"{epoch+1},{epoch_train_loss:.4f},{epoch_train_acc.item():.4f},{epoch_val_loss:.4f},{epoch_val_acc.item():.4f}\n")

        scheduler.step(epoch_val_loss)

        print(f"Epoch {epoch+1}/{args.epochs} "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f} | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")

        # early stopping
        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            epochs_no_improve = 0
            print("--> Saving best text model...")
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_loss': best_val_loss,
                'log_path': str(log_file_path),
            }, model_save_path)
        else:
            epochs_no_improve += 1
            print(f"--> Early stopping patience: {epochs_no_improve}/3")
            if epochs_no_improve >= 3:
                print("=======================================")
                print("Early stopping triggered! Training halted.")
                print("=======================================")
                break

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Train Deepfake Text Detector")
    parser.add_argument('--data_dir', type=str, default='./datasets/text', help='Path to datasets root folder')
    parser.add_argument('--model_name', type=str, default='distilroberta-base', help='HuggingFace base model')
    parser.add_argument('--batch_size', type=int, default=16, help='Batch size for training')
    parser.add_argument('--epochs', type=int, default=5, help='Number of epochs to train')
    parser.add_argument('--lr', type=float, default=2e-5, help='Learning rate')

    args = parser.parse_args()
    train_text(args)
