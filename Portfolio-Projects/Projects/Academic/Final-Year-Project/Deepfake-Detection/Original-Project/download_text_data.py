import os
import argparse
from pathlib import Path
from datasets import load_dataset
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

# Configurable parameter to prevent downloading Terabytes of data unnecessarily
MAX_SAMPLES = 20000 

# Dataset catalog from thesis requirements
DATASETS_CONFIG = {
    # 1. Verified Human Text Datasets
    "bookcorpus": {"path": "rojagtap/bookcorpus", "name": None, "split": "train"},
    "pg19": {"path": "emozilla/pg19", "name": None, "split": "train"},
    "wikitext-103": {"path": "Salesforce/wikitext", "name": "wikitext-103-raw-v1", "split": "train"},
    "reddit": {"path": "sentence-transformers/reddit-title-body", "name": None, "split": "train"},
    
    # 2. AI vs. Human Contrastive Datasets
    "hc3_all": {"path": "Hello-SimpleAI/HC3", "name": "all", "split": "train"},
    "argugpt": {"path": "SJTU-CL/ArguGPT", "name": None, "split": "train"},
    "apt": {"path": "tasksource/apt", "name": None, "split": "train"},
    
    # 3. Instruction Fine-Tuning & Rewriting
    "paws-x": {"path": "hgissbkh/paws-x", "name": None, "split": "train"},  # Note: Requires HF Auth usually
    "alpaca": {"path": "tatsu-lab/alpaca", "name": None, "split": "train"},
    "dolly": {"path": "databricks/databricks-dolly-15k", "name": None, "split": "train"},
    
    # 4. Adversarial Edge-Case
    "toxicity": {"path": "allenai/real-toxicity-prompts", "name": None, "split": "train"},
}

def download_and_save_dataset(key, config, output_dir, max_samples=MAX_SAMPLES):
    target_path = Path(output_dir) / key
    if target_path.exists():
        print(f"[-] {key} already exists locally at {target_path}. Skipping.")
        return

    print(f"[*] Downloading {key} from HuggingFace...")
    try:
        if config["name"]:
            ds = load_dataset(config["path"], config["name"], split=config["split"], streaming=True)
        else:
            ds = load_dataset(config["path"], split=config["split"], streaming=True)
            
        print(f"    --> Converting streaming format to local dataset (Limit: {max_samples} samples)...")
        
        # Take a subset to prevent massive space usage, using the streaming API to avoid downloading gigabytes
        ds_subset = ds.take(max_samples)
        
        # Convert to a standard Dataset object before saving
        from datasets import Dataset
        records = [item for item in ds_subset]
        
        if len(records) == 0:
            print(f"[!] Warning: No records found for {key}.")
            return
            
        local_ds = Dataset.from_list(records)
        local_ds.save_to_disk(str(target_path))
        print(f"[+] Successfully saved {key} to {target_path} | Size: {len(local_ds)} rows")
        
    except Exception as e:
        print(f"[!] ERROR downloading {key}: {e}")
        print("    Ensure you are logged into HuggingFace (huggingface-cli login) if this is a gated dataset.")

def main():
    parser = argparse.ArgumentParser(description="Download Text Datasets for AI Detection")
    parser.add_argument("--out_dir", type=str, default="./datasets/text", help="Output directory")
    parser.add_argument("--samples", type=int, default=MAX_SAMPLES, help="Max records per dataset")
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    print(f"Starting Dataset Fetcher | Target Output: {args.out_dir} | Max Samples: {args.samples}")
    print("-----------------------------------------------------------------------------------------")

    for key, config in DATASETS_CONFIG.items():
        download_and_save_dataset(key, config, args.out_dir, args.samples)
        
    print("\nAll downloads completed!")

if __name__ == "__main__":
    main()
