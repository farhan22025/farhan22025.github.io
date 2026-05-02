import os
from pathlib import Path
from PIL import Image, ImageFile
import warnings

# Prevent truncated image errors from aborting the load or returning black squares
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Disable DecompressionBombWarning for large images
Image.MAX_IMAGE_PIXELS = None
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

class DeepfakeDataset(Dataset):
    """
    A unified Dataset class to load images from the 5 custom datasets:
    - CASIA2
    - CG1050
    - CIFAKE
    - CoMoFoD_small_v2
    - DETECTAIVSHUMAN

    Labels:
    0 = Real
    1 = Fake (AI Generated, Tampered, Copy-Move, etc.)
    """

    def __init__(self, root_dir, split="train", transform=None, val_split=0.1):
        self.root_dir = Path(root_dir)
        self.split = split
        self.transform = transform
        self.samples = []  # List of tuples: (file_path, label)
        
        # Real = 0, Fake = 1
        
        # 1. CASIA2
        casia_dir = self.root_dir / "CASIA2"
        if casia_dir.exists():
            self._load_folder(casia_dir / "Au", label=0)
            self._load_folder(casia_dir / "Tp", label=1)

        # 2. CG1050
        cg1050_dir = self.root_dir / "CG1050"
        if cg1050_dir.exists():
            self._load_folder(cg1050_dir / "TRAINING_CG-1050" / "TRAINING" / "ORIGINAL", label=0)
            self._load_folder(cg1050_dir / "TRAINING_CG-1050" / "TRAINING" / "TAMPERED", label=1)
            self._load_folder(cg1050_dir / "VALIDATION_CG-1050" / "VALIDATION" / "ORIGINAL", label=0)
            self._load_folder(cg1050_dir / "VALIDATION_CG-1050" / "VALIDATION" / "TAMPERED", label=1)

        # 3. CIFAKE
        cifake_dir = self.root_dir / "CIFAKE"
        if cifake_dir.exists():
            cifake_target = cifake_dir / self.split
            if self.split == 'val':
                 cifake_target = cifake_dir / "test" 
            if cifake_target.exists():
                self._load_folder(cifake_target / "REAL", label=0)
                self._load_folder(cifake_target / "FAKE", label=1)

        # 4. CoMoFoD_small_v2
        comofod_dir = self.root_dir / "CoMoFoD_small_v2"
        if comofod_dir.exists():
            self._load_folder(comofod_dir, label=1)

        # 5. DETECTAIVSHUMAN
        detect_dir = self.root_dir / "DETECTAIVSHUMAN"
        if detect_dir.exists():
            detect_target = detect_dir / self.split
            if self.split == 'val':
                 detect_target = detect_dir / "test"
            if detect_target.exists():
                self._load_folder(detect_target / "real", label=0)
                self._load_folder(detect_target / "fake", label=1)
                
        # 6. Certificates (Fraud/Forged Documents)
        cert_dir = self.root_dir / "Certificates"
        if cert_dir.exists():
            # Support both split architectures implicitly
            cert_target = cert_dir / self.split if (cert_dir / self.split).exists() else cert_dir
            if self.split == 'val' and (cert_dir / "test").exists(): cert_target = cert_dir / "test"
            self._load_folder(cert_target / "Real", label=0)
            self._load_folder(cert_target / "Fake", label=1)
            
        # 7. Tools (Exploited/Deepfake Tech Interfaces)
        tools_dir = self.root_dir / "Tools"
        if tools_dir.exists():
            tools_target = tools_dir / self.split if (tools_dir / self.split).exists() else tools_dir
            if self.split == 'val' and (tools_dir / "test").exists(): tools_target = tools_dir / "test"
            self._load_folder(tools_target / "Real", label=0)
            self._load_folder(tools_target / "Fake", label=1)

        # Split logic (deterministic) for datasets that don't have explicit splits
        # We use a simple hash of the path to determine split to avoid data leakage
        filtered_samples = []
        for path, label in self.samples:
            path_hash = hash(str(path)) % 100
            if split == "train" and path_hash >= (val_split * 100):
                filtered_samples.append((path, label))
            elif split in ["val", "test"] and path_hash < (val_split * 100):
                filtered_samples.append((path, label))
        
        self.samples = filtered_samples

    def _load_folder(self, folder_path, label):
        if not folder_path.exists():
            print(f"Warning: Folder not found {folder_path}")
            return
            
        valid_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}
        for root, _, files in os.walk(folder_path):
            for file in files:
                if Path(file).suffix.lower() in valid_extensions:
                    self.samples.append((Path(root) / file, label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        try:
            image = Image.open(img_path)
            # Resolve Palette images with transparency warning
            if image.mode == 'P' and 'transparency' in image.info:
                image = image.convert('RGBA')
            image = image.convert("RGB")
        except Exception as e:
            # Fallback for corrupted images
            print(f"Error loading {img_path}: {e}")
            image = Image.new("RGB", (224, 224), (0, 0, 0))
            
        if self.transform:
            image = self.transform(image)
        return image, label

def get_dataloaders(root_dir, batch_size=32, num_workers=8):
    """
    Returns train and validation dataloaders
    """
    # Standard EfficientNet / ImageNet transforms
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomCrop((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = DeepfakeDataset(root_dir, split="train", transform=train_transform)
    val_dataset = DeepfakeDataset(root_dir, split="val", transform=val_transform)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=True)

    return train_loader, val_loader
