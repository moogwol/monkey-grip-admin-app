#!/bin/bash
docker exec -it $(docker compose ps -q db) psql -U user -d contactsdb