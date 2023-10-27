docker run -i -t \
  -p 3030:80 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e AUTH_TOKEN=$AUTH_TOKEN \ 
  -e ALLOWED_HOSTS="localhost:3030" \
  -v /home/user/ipilot:/mnt/data \
  silvanmelchior/incognito-pilot:latest-slim