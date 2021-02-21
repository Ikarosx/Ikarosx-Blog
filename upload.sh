rm -rf public
yarn run build
# find public -name "*.mp3" | xargs rm -f
scp -r public root@ikarosx.cn:/usr/share/nginx/yps/html/blog