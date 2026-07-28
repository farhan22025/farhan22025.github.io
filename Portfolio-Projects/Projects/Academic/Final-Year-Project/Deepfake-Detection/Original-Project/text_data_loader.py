import os
import torch
from torch.utils.data import Dataset, DataLoader
from datasets import load_from_disk
from transformers import AutoTokenizer

class AIDetectionTextDataset(Dataset):
    """
    Unified Dataset for AI vs Human text detection.
    Reads locally saved HuggingFace datasets and maps them to a binary classification schema:
    0 = Human (Real)
    1 = AI Generated (Fake)
    """
    def __init__(self, data_dir="./datasets/text", tokenizer_name="distilroberta-base", max_length=512):
        self.data_dir = data_dir
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        self.max_length = max_length
        self.samples = [] # List of tuples: (text, label)
        
        self._load_datasets()

    def _load_datasets(self):
        """Iterates over recognized raw datasets and normalizes them."""
        if not os.path.exists(self.data_dir):
            print(f"[!] Text datasets directory {self.data_dir} not found. Ensure you ran download_text_data.py first.")
            return

        # 1. Human (Label 0)
        human_sources = ["bookcorpus", "pg19", "wikitext-103", "reddit"]
        for src in human_sources:
            path = os.path.join(self.data_dir, src)
            if os.path.exists(path):
                ds = load_from_disk(path)
                for item in ds:
                    text = item.get("text") or item.get("body") or ""
                    if len(text.strip()) > 20: 
                        self.samples.append((text, 0))

        # 2. AI (Label 1)
        ai_sources = ["alpaca", "dolly"]
        for src in ai_sources:
            path = os.path.join(self.data_dir, src)
            if os.path.exists(path):
                ds = load_from_disk(path)
                for item in ds:
                    text = item.get("output") or item.get("response") or ""
                    if len(text.strip()) > 20:
                        self.samples.append((text, 1))

        # 3. Contrastive/Mixed (HC3)
        hc3_path = os.path.join(self.data_dir, "hc3_all")
        if os.path.exists(hc3_path):
            ds = load_from_disk(hc3_path)
            for item in ds:
                # HC3 structure uses human_answers (list) and chatgpt_answers (list)
                human_ans = item.get("human_answers", [])
                ai_ans = item.get("chatgpt_answers", [])
                
                for ans in human_ans:
                    if len(ans.strip()) > 20: self.samples.append((ans, 0))
                for ans in ai_ans:
                    if len(ans.strip()) > 20: self.samples.append((ans, 1))

        print(f"[+] Loaded {len(self.samples)} total text samples for training/validation mapping.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        text, label = self.samples[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        
        # return_tensors creates [1, seq_len], we squeeze to [seq_len]
        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(label, dtype=torch.long)
        }

def get_text_dataloaders(data_dir="./datasets/text", batch_size=16, split_ratio=0.8):
    """
    Returns (train_loader, val_loader) configured for text modeling.
    """
    dataset = AIDetectionTextDataset(data_dir=data_dir)
    
    if len(dataset) == 0:
        raise ValueError("No data loaded. Check if the datasets/text folder contains downloaded arrows.")

    train_size = int(split_ratio * len(dataset))
    val_size = len(dataset) - train_size
    
    # PyTorch random split to avoid domain bias
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, pin_memory=True)
    
    return train_loader, val_loader
