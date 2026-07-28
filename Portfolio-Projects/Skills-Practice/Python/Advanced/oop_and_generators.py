# Python Advanced - oop_and_generators.py
# Student: Farhan Alam | Data Science

# ─── OOP: Class Hierarchy ─────────────────────────────────────────────────────
class MLModel:
    """Base class for any ML model."""
    def __init__(self, name, version):
        self.name = name
        self.version = version
        self._is_trained = False

    def train(self, data):
        raise NotImplementedError("Subclass must implement train()")

    def predict(self, sample):
        if not self._is_trained:
            raise RuntimeError("Model must be trained before predicting!")
        return self._predict_logic(sample)

    def _predict_logic(self, sample):
        raise NotImplementedError

    def __repr__(self):
        status = "trained" if self._is_trained else "untrained"
        return f"<{self.name} v{self.version} [{status}]>"


class SimpleKNNClassifier(MLModel):
    """A minimal KNN-like mock classifier for practice."""
    def __init__(self, k=3):
        super().__init__("SimpleKNN", "1.0")
        self.k = k
        self._data = []

    def train(self, data):
        self._data = data
        self._is_trained = True
        print(f"[{self.name}] Trained on {len(data)} samples with k={self.k}")

    def _predict_logic(self, sample):
        # Just mock logic for demo: check if sample is in data
        return "positive" if sample in self._data else "negative"


# ─── Generator: Streaming Data ────────────────────────────────────────────────
def data_stream(total_records, batch_size=10):
    """Simulates streaming data in batches — memory-efficient pattern."""
    for start in range(0, total_records, batch_size):
        batch = list(range(start, min(start + batch_size, total_records)))
        yield batch


# ─── Decorator ────────────────────────────────────────────────────────────────
import time

def timer(func):
    """Simple decorator to time function execution."""
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - t0
        print(f"[timer] {func.__name__}() executed in {elapsed:.4f}s")
        return result
    return wrapper

@timer
def run_pipeline():
    model = SimpleKNNClassifier(k=5)
    training_data = [10, 20, 30, 40, 50]
    model.train(training_data)
    print(model)
    print(f"  Predict 20 -> {model.predict(20)}")
    print(f"  Predict 99 -> {model.predict(99)}")

    # Stream 35 items in batches of 10
    print("\n[data_stream] Streaming 35 items in batches of 10:")
    for i, batch in enumerate(data_stream(35, 10)):
        print(f"  Batch {i+1}: {batch}")


if __name__ == "__main__":
    run_pipeline()
