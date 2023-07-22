import time

# Function to measure elapsed time
def measure_elapsed_time(func: callable):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print([args[0]])
        print(f"Elapsed time: {elapsed_time:.4f} seconds")
        return result
    return wrapper