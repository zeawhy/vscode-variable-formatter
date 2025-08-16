# Variable Formatter

一个强大的VSCode插件，用于格式化代码中的变量名，支持多种命名规范转换。

## 功能特性

- 🔄 支持多种命名规范转换：
  - **camelCase** (驼峰命名): `myVariable`
  - **PascalCase** (帕斯卡命名): `MyVariable`
  - **snake_case** (下划线命名): `my_variable`
  - **kebab-case** (短横线命名): `my-variable`
  - **SCREAMING_SNAKE_CASE** (大写下划线命名): `MY_VARIABLE`

- 🎯 智能变量名识别和解析
- ⚡ 快捷键支持
- 🔧 可配置的默认命名规范
- 🌐 根据编程语言自动推荐命名规范
- 📦 批量转换整个文件中的所有变量
- 👀 预览功能：转换前查看所有可能的格式化结果

## 安装

1. 打开VSCode
2. 按 `Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (Mac) 打开扩展面板
3. 搜索 "Variable Formatter"
4. 点击安装

## 使用方法

### 基本使用

1. 在编辑器中选中要格式化的变量名
2. 使用以下方式之一：
   - **快捷键**: `Ctrl+Shift+F` (Windows/Linux) 或 `Cmd+Shift+F` (Mac)
   - **命令面板**: `Ctrl+Shift+P` 然后输入 "Format Variable"
   - **右键菜单**: 选择相应的格式化选项

### 可用命令

- `Format Variable (Choose Convention)` - 弹出选择框选择命名规范
- `Format to camelCase` - 直接转换为驼峰命名
- `Format to PascalCase` - 直接转换为帕斯卡命名
- `Format to snake_case` - 直接转换为下划线命名
- `Format to kebab-case` - 直接转换为短横线命名
- `Format to SCREAMING_SNAKE_CASE` - 直接转换为大写下划线命名
- `Format All Variables in File` - 批量转换文件中的所有变量
- `Preview Variable Formatting` - 预览所有格式化选项

### 示例

```javascript
// 选中变量名并格式化
my_variable_name    → myVariableName (camelCase)
MyVariableName      → my_variable_name (snake_case)
my-variable-name    → MyVariableName (PascalCase)
camelCaseVar        → camel-case-var (kebab-case)
api_key             → API_KEY (SCREAMING_SNAKE_CASE)

// 批量转换示例
// 转换前:
const user_name = 'john';
const user_email = 'john@example.com';
const api_key = 'secret';

// 转换后 (camelCase):
const userName = 'john';
const userEmail = 'john@example.com';
const apiKey = 'secret';
```

## 配置选项

在VSCode设置中可以配置以下选项：

```json
{
  "variableFormatter.defaultConvention": "camelCase",
  "variableFormatter.autoDetectLanguage": true
}
```

### 配置说明

- `defaultConvention`: 默认的命名规范 (camelCase, PascalCase, snake_case, kebab-case)
- `autoDetectLanguage`: 是否根据文件语言自动检测推荐的命名规范

## 语言推荐规范

插件会根据不同的编程语言推荐相应的命名规范：

| 语言 | 推荐规范 |
|------|----------|
| JavaScript/TypeScript | camelCase |
| Java | camelCase |
| C# | PascalCase |
| Python | snake_case |
| Rust | snake_case |
| C/C++ | snake_case |
| CSS/SCSS/Less | kebab-case |
| HTML | kebab-case |

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+F` (Windows/Linux)<br>`Cmd+Shift+F` (Mac) | 格式化变量（选择规范） |

## 支持的变量名格式

插件能够识别和转换以下格式的变量名：

- 驼峰命名: `camelCase`, `myVariableName`
- 帕斯卡命名: `PascalCase`, `MyVariableName`
- 下划线命名: `snake_case`, `my_variable_name`
- 短横线命名: `kebab-case`, `my-variable-name`
- 混合格式: `mixed_camelCase`, `kebab-PascalCase`

## 开发

### 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd vscode-variable-formatter

# 安装依赖
npm install

# 编译
npm run compile

# 监听模式编译
npm run watch
```

### 测试

1. 按 `F5` 启动扩展开发主机
2. 在新窗口中测试插件功能

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 更新日志

### 0.0.1

- 初始版本
- 支持四种主要命名规范转换
- 智能变量名识别
- 快捷键支持
- 可配置选项