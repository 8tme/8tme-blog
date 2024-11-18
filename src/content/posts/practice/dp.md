
### 1. 动态规划的核心特征
问题需要具备以下特征才适合使用 DP：
#### 1. 最优子结构：大问题的最优解包含小问题的最优解
#### 2. 重叠子问题：在求解过程中会反复遇到相同的子问题
#### 3. 无后效性：后面的状态不会影响前面的状态


#### 2.1 线性 DP
```typescript
// 示例：斐波那契数列
function fibonacci(n: number): number {
    const dp: number[] = new Array(n + 1).fill(0);
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}
```


#### 2.2 区间 DP
```typescript
// 示例：最长回文子串
function longestPalindrome(s: string): string {
    const n = s.length;
    const dp: boolean[][] = Array.from({length: n}, () => new Array(n).fill(false));
    let start = 0, maxLength = 1;
    
    // 所有单个字符都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // 检查长度大于1的子串
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i < n - len + 1; i++) {
            const j = i + len - 1;
            
            if (len === 2) {
                dp[i][j] = s[i] === s[j];
            } else {
                dp[i][j] = (s[i] === s[j]) && dp[i+1][j-1];
            }
            
            if (dp[i][j] && len > maxLength) {
                start = i;
                maxLength = len;
            }
        }
    }
    
    return s.substring(start, start + maxLength);
}
```


#### 2.3 背包类 DP
```typescript
// 示例：0-1背包问题
function knapsack(weights: number[], values: number[], capacity: number): number {
    const n = weights.length;
    const dp: number[][] = Array.from({length: n + 1}, 
        () => new Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    dp[i-1][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    return dp[n][capacity];
}
```


### 3. 具体应用场景


#### 3.1 路径规划类

- 最小路径和
- 不同路径数量
- 机器人移动范围

```typescript
// 示例：最小路径和
function minPathSum(grid: number[][]): number {
    const m = grid.length, n = grid[0].length;
    const dp: number[][] = Array.from({length: m}, 
        () => new Array(n).fill(Infinity));
    
    dp[0][0] = grid[0][0];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i > 0) {
                dp[i][j] = Math.min(dp[i][j], dp[i-1][j] + grid[i][j]);
            }
            if (j > 0) {
                dp[i][j] = Math.min(dp[i][j], dp[i][j-1] + grid[i][j]);
            }
        }
    }
    
    return dp[m-1][n-1];
}
```


#### 3.2 字符串编辑类

- 编辑距离
- 最长公共子序列
- 最长回文子串
- 正则表达式匹配


#### 3.3 股票交易类
- 买卖股票的最佳时机
- 含冷冻期的股票交易


### 4. 解题步骤

#### 1. 确定状态定义
   - 明确 dp 数组/对象的含义
   - 确定维度（一维、二维等）
#### 2. 找出状态转移方程
   - 分析问题的递推关系
   - 写出数学表达式
#### 3. 确定初始条件和边界情况
   - 设置初始值
   - 处理边界情况
#### 4. 确定计算顺序
   - 从小到大还是从大到小
   - 是否需要优化空间复杂度
### 5. 优化技巧

```typescript
// 空间优化示例：斐波那契数列
function fibonacciOptimized(n: number): number {
    if (n <= 1) return n;
    
    let prev = 0, curr = 1;
    
    for (let i = 2; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
    }
    
    return curr;
}
```


### 6. 实际应用建议

#### 1. 分析问题特征
- 是否有重叠子问题
- 是否具有最优子结构
#### 2. 画图辅助思考
- 状态转移图
- 决策树
#### 3. 先暴力解法
- 找到递归关系
- 再优化成 DP
#### 4. 注意边界条件
- 数组为空
- 特殊输入

动态规划虽然强大，但不是所有问题都适合用 DP 解决。需要根据具体问题特征选择合适的解法