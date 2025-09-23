#!/bin/bash
docker exec -it $(docker compose ps -q db) psql -U bjjuser -d bjj_club_db