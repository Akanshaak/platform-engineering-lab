FROM python:3.12.0-slim
ENV PYTHONUNBUFFERED 1
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    vim \
    curl \
    git \
    procps \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir /app
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/
EXPOSE 10099
ENTRYPOINT /app/bin/entrypoint.sh
