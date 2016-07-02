# Shanbay
a django project for SE

Please run following command first:
```bash
git update-index --skip-worktree shanbay/my.cnf
```

# administrator
Create a superuser:
```bash
python manage.py createsuperuser
```
用你注册的帐号登录<a href="localhost:8000/admin">localhost:8000/admin</a>，进行数据库管理，如创建customs，restaurant，方便调试。