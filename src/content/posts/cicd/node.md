# Ubuntu 上升级 Node.js 版本

在 Ubuntu 上升级 Node.js，推荐优先使用 `nvm`（Node Version Manager），因为它支持多版本共存、切换方便、对 CI/CD 也友好。

## 方案一：使用 nvm 升级（推荐）

### 1) 安装 nvm（若已安装可跳过）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
```

如果你使用的是 `zsh`，执行：

```bash
source ~/.zshrc
```

### 2) 查看可安装的 Node 版本

```bash
nvm ls-remote --lts
```

### 3) 安装并切换到目标版本（示例：Node 22）

```bash
nvm install 22
nvm use 22
```

### 4) 设置默认版本

```bash
nvm alias default 22
```

### 5) 验证版本

```bash
node -v
npm -v
which node
```

---

## 方案二：使用 NodeSource 升级（系统级安装）

如果你希望使用系统级 Node（非 nvm 管理），可以用 NodeSource：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证：

```bash
node -v
npm -v
```

---

## 常见问题

### 1) 升级后版本没变化

- 先执行 `which node` 看当前生效路径。
- 若路径不是 `~/.nvm/...`，说明 shell 还没加载 nvm，重新 `source ~/.bashrc` 或 `source ~/.zshrc`。

### 2) sudo 下版本不一致

- `nvm` 安装的是当前用户环境，`sudo` 可能走系统 Node。
- CI/CD 中建议避免 `sudo npm`，并统一用同一种 Node 管理方式。
