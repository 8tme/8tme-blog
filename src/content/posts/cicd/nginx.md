# Nginx 高频常用命令（Ubuntu）

只整理日常最常用的命令，覆盖：服务管理、配置生效、日志排查、站点启停。

## 1) 服务管理（最常用）

```bash
# 启动 Nginx
sudo systemctl start nginx

# 停止 Nginx
sudo systemctl stop nginx

# 重启 Nginx（会短暂中断连接）
sudo systemctl restart nginx

# 重载配置（不中断现有连接，优先用这个）
sudo systemctl reload nginx

# 查看运行状态
sudo systemctl status nginx

# 设置开机自启
sudo systemctl enable nginx
```

## 2) 配置检查与生效（部署必备）

```bash
# 检查配置语法是否正确（改完配置先跑这个）
sudo nginx -t

# 查看 Nginx 编译参数和配置路径
nginx -V
```

推荐操作顺序：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 3) 日志排查（线上最常用）

```bash
# 实时看访问日志
sudo tail -f /var/log/nginx/access.log

# 实时看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看最近 100 行错误日志
sudo tail -n 100 /var/log/nginx/error.log
```

## 4) 站点配置启用/停用（Ubuntu 常见）

```bash
# 启用某个站点配置（软链接到 sites-enabled）
sudo ln -s /etc/nginx/sites-available/example.conf /etc/nginx/sites-enabled/

# 禁用某个站点配置
sudo rm /etc/nginx/sites-enabled/example.conf

# 列出已启用站点
ls -l /etc/nginx/sites-enabled/
```

每次改完站点配置后，记得执行：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 5) 常见端口占用检查（配合 Nginx 排错）

```bash
# 查看 80/443 端口占用
sudo lsof -i :80
sudo lsof -i :443
```


## 6) 简单的配置
```conf
server {
    listen 80 default_server;
    server_name _;

    root /home/ecs-user/web/alpha-staking/dist;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    location /_next/static/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }
}
```

## 7) 错误信息
```bash
# 1) 实时看错误日志（最重要）
sudo tail -f /var/log/nginx/error.log
# 2) 实时看访问日志
sudo tail -f /var/log/nginx/access.log
# 3) 看最近 200 行错误日志
sudo tail -n 200 /var/log/nginx/error.log
# 4) 看 nginx 服务日志（systemd）
sudo journalctl -u nginx -n 200 --no-pager
```

保存配置：
```bash
:w !sudo tee %
```