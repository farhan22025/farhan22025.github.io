import torch
import torch.nn as nn
from torchvision import models

def get_deepfake_model(num_classes=2, weights="DEFAULT"):
    """
    Returns a lightweight EfficientNetV2-S model tailored for binary classification
    (Real vs Fake).
    Args:
        num_classes (int): Number of output classes (2 for Fake/Real)
        weights (str): Pre-trained weights to use. "DEFAULT" uses optimal ImageNet weights.
    """
    # Load EfficientNetV2-S. It's highly optimized for speed and accuracy.
    model = models.efficientnet_v2_s(weights=weights)
    
    # Replace the final classification head
    # efficientnet_v2_s classifier is a Sequential block with Dropout(p=0.2, inplace=True) and Linear
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    
    return model

if __name__ == "__main__":
    # Quick instantiation test
    model = get_deepfake_model()
    x = torch.randn(1, 3, 224, 224)
    out = model(x)
    print(f"Model instantiated successfully. Output shape: {out.shape}")
