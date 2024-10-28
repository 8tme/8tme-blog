---
title: 提升条件渲染可读性
date: 2024-09-02
summary: 提前返回以提升代码质量
category: 项目
tags: [react]
---

### 场景

```tsx
interface Props {
  userInfo?: object
  outLoading: boolean
}

const Page: React.FC<Props> = (props: Props) => {
  const { userInfo, outLoading } = props
  const { data, loading } = useListData(userInfo)

  return (
    <Container>
      {outLoading ? (
        <Skeleton />
      ) : (
        <>
          {userInfo && <UserInfo data={userInfo} />}
          {loading ? (
            <Loading />
          ) : (
            data?.length ? data.map((n) => <div key={n}>{n}</div>) : <Empty />
          )}
        </>
      )}
    </Container>
  )
}
```

### 优化

```tsx
interface Props {
  userInfo?: object
  outLoading: boolean
}

const Page: React.FC<Props> = (props: Props) => {
  const { userInfo, outLoading } = props
  const { data, loading } = useListData(userInfo)

  if (outLoading) {
    return (
      <Container>
        <Skeleton />
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <UserInfo data={userInfo} />
        <Loading />
      </Container>
    )
  }

  return <Container>{data?.length ? data.map((n) => <div key={n}>{n}</div>) : <Empty />}</Container>
}
```


### 认知负担

我们阅读代码的时候，会讲阅读到的变量、控制语句、调用顺序和符号等内容记录在大脑中，一般人大脑能记忆大约 4 部分内容，超过4 个部分则会带来认知负担。