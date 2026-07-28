import torch
import torch.nn as nn
import torch.optim as optim
import argparse
from pathlib import Path

from data_loader import get_dataloaders
from model import get_deepfake_model

def train(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on device: {device}")

    # Load data
    train_loader, val_loader = get_dataloaders(args.data_dir, batch_size=args.batch_size)

    # Load model
    model = get_deepfake_model(num_classes=2).to(device)

    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-2)

    # Learning rate scheduler
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=2, factor=0.5)

    # Mixed precision scaler
    scaler = torch.amp.GradScaler('cuda', enabled=torch.cuda.is_available())

    best_val_loss = float('inf')
    start_epoch = 0
    epochs_no_improve = 0

    # Setup logging directory and specific scratch log path
    import datetime
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file_path = logs_dir / f"training_log_1_{timestamp}.csv"

    # Auto-resume logic
    model_save_path = Path("best_deepfake_model.pth")

    if model_save_path.exists():
        checkpoint = torch.load(model_save_path, map_location=device, weights_only=True)
        last_epoch = checkpoint.get('epoch', 0)
        
        # Check if the model is half-trained
        if last_epoch < args.epochs - 1:
            print(f"--> Found previously half-trained progress at epoch {last_epoch + 1}/{args.epochs}")
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
                    else:
                        # Fallback for old checkpoints
                        log_file_path = Path("training_log.csv")
                    break
                elif choice in ['n', 'no']:
                    print(f"--> Starting training from scratch (new log file created in logs folder; previous best checkpoint WILL be overwritten).")
                    with open(log_file_path, "w") as f:
                        f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")
                    break
                else:
                    print("Invalid input. Please enter 'y' to resume, or 'n' to train from scratch.")
        else:
            print(f"--> Found fully trained model (completed {last_epoch + 1} epochs). Starting new scratch training.")
            with open(log_file_path, "w") as f:
                f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")
    else:
        # No checkpoint found, fresh training
        with open(log_file_path, "w") as f:
            f.write("Epoch,Train_Loss,Train_Acc,Val_Loss,Val_Acc\n")

    for epoch in range(start_epoch, args.epochs):
        # Training Phase
        model.train()
        train_loss = 0.0
        train_correct = 0

        for batch_idx, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()

            with torch.amp.autocast('cuda', enabled=torch.cuda.is_available()):
                outputs = model(inputs)
                loss = criterion(outputs, labels)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            train_correct += torch.sum(preds == labels.data)

            if batch_idx % 10 == 0:
                print(f"\rTraining Epoch {epoch+1}/{args.epochs} - Batch {batch_idx}/{len(train_loader)} - Loss: {loss.item():.4f}", end="", flush=True)
                
        print() # Move to next line when epoch is done
        epoch_train_loss = train_loss / len(train_loader.dataset)
        epoch_train_acc = train_correct.double() / len(train_loader.dataset)

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0

        with torch.no_grad():
            for batch_idx, (inputs, labels) in enumerate(val_loader):
                inputs, labels = inputs.to(device), labels.to(device)
                
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data)

                if batch_idx % 10 == 0:
                    print(f"\rValidating Epoch {epoch+1}/{args.epochs} - Batch {batch_idx}/{len(val_loader)} - Loss: {loss.item():.4f}", end="", flush=True)

        print() # Move to next line when validation is done
        epoch_val_loss = val_loss / len(val_loader.dataset)
        epoch_val_acc = val_correct.double() / len(val_loader.dataset)

        # Log epoch results to CSV so they are never lost
        with open(log_file_path, "a") as f:
            f.write(f"{epoch+1},{epoch_train_loss:.4f},{epoch_train_acc.item():.4f},{epoch_val_loss:.4f},{epoch_val_acc.item():.4f}\n")

        scheduler.step(epoch_val_loss)

        print(f"Epoch {epoch+1}/{args.epochs} "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f} | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")

        # Save Best Model and Early Stopping
        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            epochs_no_improve = 0
            print("--> Saving best model...")
            model_save_path = Path("best_deepfake_model.pth")
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
    parser = argparse.ArgumentParser(description="Train Deepfake Image Detector")
    parser.add_argument('--data_dir', type=str, default='./datasets', help='Path to datasets root folder')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size for training')
    parser.add_argument('--epochs', type=int, default=10, help='Number of epochs to train')
    parser.add_argument('--lr', type=float, default=1e-4, help='Learning rate')

    args = parser.parse_args()
    train(args)
