FROM nginx:1.14.2-alpine
COPY ./build /var/www/toc.evmon.io
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3013

CMD ["nginx", "-g", "daemon off;"]

