FROM python:3.10-slim

WORKDIR /backend

# Copy everything from the build context (which is ./backend)
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "run.py"]
