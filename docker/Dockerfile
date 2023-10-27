FROM node:18-alpine

WORKDIR /opt/app

COPY ui ui
COPY VERSION VERSION

RUN cd ui && \
    npm install && \
    npm run build

FROM silvanmelchior/interpreter-venv:1.0.0
SHELL ["/bin/bash", "-c"]

WORKDIR /opt/app
COPY --from=0 /opt/app/ui/out /opt/app/ui

RUN apt update && apt install -y nginx

COPY services services
COPY .env .env

RUN python3 -m venv venv_services && \
    source venv_services/bin/activate && \
    pip3 install ./services

COPY docker/nginx.conf /etc/nginx/

COPY docker/start* .
RUN chmod 755 start*
CMD ["/opt/app/start.sh"]
