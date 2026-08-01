import pty
import os
import sys

def read(fd):
    try:
        data = os.read(fd, 1024)
        sys.stdout.write(data.decode())
        sys.stdout.flush()
        if b'rename column' in data:
            os.write(fd, b'\r')
        return data
    except OSError:
        return b""

pty.spawn(["npx", "drizzle-kit", "generate"], read)
