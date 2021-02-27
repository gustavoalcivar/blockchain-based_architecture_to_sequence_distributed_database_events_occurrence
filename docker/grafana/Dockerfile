FROM grafana/grafana

COPY dashboards /etc/grafana/dashboards
COPY datasources /etc/grafana/datasources
COPY grafana.ini /etc/grafana

WORKDIR /app
COPY grafana_entrypoint.sh ./
USER root
RUN chmod +x grafana_entrypoint.sh

ENTRYPOINT ["/app/grafana_entrypoint.sh"]
