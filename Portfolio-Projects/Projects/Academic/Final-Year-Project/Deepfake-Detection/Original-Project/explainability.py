import torch
import torch.nn.functional as F
import numpy as np
import cv2

class GradCAM:
    """
    Computes Grad-CAM for a given model and target layer.
    """
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.feature_maps = None
        self.gradients = None

        # Register hooks
        self.target_layer.register_forward_hook(self.save_feature_maps)
        self.target_layer.register_backward_hook(self.save_gradients)

    def save_feature_maps(self, module, input, output):
        self.feature_maps = output.detach()

    def save_gradients(self, module, grad_in, grad_out):
        self.gradients = grad_out[0].detach()

    def __call__(self, x, class_idx=None):
        """
        x: Input tensor [1, C, H, W]
        class_idx: The class index to compute gradients for. If None, uses the model's highest scoring class.
        returns: heatmap array (H, W) values in [0, 1]
        """
        self.model.eval()
        
        # Enable gradients for the input if necessary, but we really just need gradients to flow back to the target layer.
        self.model.zero_grad()
        
        output = self.model(x)
        
        if class_idx is None:
            class_idx = output.argmax(dim=1).item()
            
        # Target representation
        one_hot = torch.zeros_like(output)
        one_hot[0][class_idx] = 1.0
        
        output.backward(gradient=one_hot, retain_graph=True)

        # Compute weights as mean of gradients over spatial dimensions (Global Average Pooling)
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)

        # Compute weighted sum of feature maps
        cam = torch.sum(weights * self.feature_maps, dim=1, keepdim=True)
        
        # ReLU to keep only positive influence
        cam = F.relu(cam)

        cam = cam.squeeze().cpu().numpy()

        # Normalize the heatmap between 0 and 1
        cam_min, cam_max = cam.min(), cam.max()
        if cam_max - cam_min > 0:
            cam = (cam - cam_min) / (cam_max - cam_min)
            
        # Resize to input dimensions
        cam = cv2.resize(cam, (x.shape[3], x.shape[2]))
        
        return cam, class_idx

def overlay_heatmap(image_np, heatmap, alpha=0.5, colormap=cv2.COLORMAP_JET):
    """
    Overlays a Grad-CAM heatmap on a numpy image array.
    image_np: (H, W, 3) in [0, 255]
    heatmap: (H, W) in [0, 1]
    """
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), colormap)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    superimposed = heatmap_colored * alpha + image_np * (1.0 - alpha)
    superimposed = np.clip(superimposed, 0, 255).astype(np.uint8)
    
    return superimposed

def draw_circle_annotations(image_np, heatmap, threshold=0.5):
    """
    Draws red circle annotations around high intensity regions of the heatmap.
    """
    annotated = image_np.copy()
    
    # Threshold heatmap
    mapped_heatmap = np.uint8(255 * heatmap)
    
    # Smooth the heatmap to reduce noise
    smoothed = cv2.GaussianBlur(mapped_heatmap, (15, 15), 0)
    _, thresh = cv2.threshold(smoothed, int(255 * threshold), 255, cv2.THRESH_BINARY)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw circles
    for contour in contours:
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)
        
        # Filter tiny noise regions
        if radius > 5:
            # Outer red circle
            cv2.circle(annotated, center, radius + 10, (255, 50, 50), 3)
            # Inner white circle (dashed-like or thinner) for visual effect
            cv2.circle(annotated, center, radius + 10, (255, 255, 255), 1)
            
    return annotated
