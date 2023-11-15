docker build --tag silvanmelchior/interpreter-venv:1.0.0 --progress plain --file docker/Dockerfile_env_full .
docker build --file ./docker/Dockerfile -t project-durango .