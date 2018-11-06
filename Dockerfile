FROM nginx:1.15.0-alpine

ARG COMMIT
ARG VERSION

ENV COVENANTSQL_EXPLORER_DOMAIN=localhost
ENV COVENANTSQL_OBSERVER_ADDR=localhost:4661

LABEL \
    name="aletheia" \
    url="https://gitlab.com/thunderdb/aletheia.git" \
    maintainer="mingjie.tang@covenantsql.io" \
    authors="Ggicci" \
    commit="${COMMIT}" \
    version="${VERSION}"

WORKDIR /app
COPY ./dist/ /usr/share/nginx/html/
COPY ./explorer.conf.template /etc/nginx/conf.d/servers/

CMD [ "/bin/sh", "-c", "envsubst < /etc/nginx/conf.d/servers/explorer.conf.template > /etc/nginx/conf.d/servers/explorer.conf && exec nginx -g 'daemon off;'" ]

EXPOSE 80
