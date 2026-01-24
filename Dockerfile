FROM nginx:1.23.3
COPY ./dist /usr/share/nginx/html
COPY ./nginx_conf/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_conf/app.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
