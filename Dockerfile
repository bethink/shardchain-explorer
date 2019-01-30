FROM nginx:1.15.0-alpine

ARG io_covenantsql_explorer_image_created
ARG io_covenantsql_explorer_image_version
ARG io_covenantsql_explorer_image_revision

LABEL \
    io.covenantsql.explorer.image.created="${io_covenantsql_explorer_image_created}" \
    io.covenantsql.explorer.image.version="${io_covenantsql_explorer_image_version}" \
    io.covenantsql.explorer.image.revision="${io_covenantsql_explorer_image_revision}" \
    io.covenantsql.explorer.image.authors="Ggicci <ggicci.t@gmail.com>" \
    io.covenantsql.explorer.image.url="https://hub.docker.com/r/covenantsql/explorer" \
    io.covenantsql.explorer.image.documentation="https://github.com/CovenantSQL/shardchain-explorer.git" \
    io.covenantsql.explorer.image.source="https://github.com/CovenantSQL/shardchain-explorer.git" \
    io.covenantsql.explorer.image.vendor="Covenant Labs" \
    io.covenantsql.explorer.image.licenses="MIT" \
    io.covenantsql.explorer.image.title="CovenantSQL ShardChain Explorer" \
    io.covenantsql.explorer.image.description="CovenantSQL shard chain web explorer."

ENV COVENANTSQL_EXPLORER_DOMAIN=localhost
ENV COVENANTSQL_OBSERVER_ADDR=localhost:4661

WORKDIR /app
COPY ./dist/ /usr/share/nginx/html/
COPY ./explorer.conf.template /etc/nginx/conf.d/servers/

CMD [ "/bin/sh", "-c", "MAGIC_DOLLAR='$' envsubst < /etc/nginx/conf.d/servers/explorer.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'" ]

EXPOSE 80
