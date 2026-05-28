# 📘 guide-console.log.md

## 1. Mục đích của `console.log`

`console.log` dùng để:

- Debug nhanh logic
- Kiểm tra dữ liệu runtime
- Theo dõi flow code
- Xác định lỗi trong async / API / blockchain

👉 Không nên dùng như logging production lâu dài.

---

## 2. Các kiểu log cơ bản

### 🔹 Log đơn giản

```ts
console.log("Hello world");
```

---

### 🔹 Log biến

```ts
console.log(user);
console.log(contractId);
```

---

### 🔹 Log nhiều biến

```ts
console.log("user:", user, "contractId:", contractId);
```

---

## 3. Log có label (BEST PRACTICE)

```ts
console.log("[ContractService] contractId:", contractId);
```

👉 Giúp dễ trace trong hệ thống lớn.

---

## 4. Log object đẹp (quan trọng)

```ts
console.log(JSON.stringify(contract, null, 2));
```

---

## 5. Log mảng

```ts
console.log("allocationResults:", allocationResults);
```

hoặc format đẹp:

```ts
console.table(allocationResults);
```

---

## 6. Log lỗi (ERROR TRACKING)

```ts
console.error("Error creating contract:", error);
```

---

## 7. Log warning

```ts
console.warn("Missing externalId");
```

---

## 8. Log debug flow (recommended pattern)

```ts
console.log("[START] createContract");
console.log("input:", input);

const contract = await repo.create(input);

console.log("created contract:", contract);

console.log("[END] createContract");
```

---

## 9. Log async flow (rất quan trọng)

```ts
console.log("Fetching allocation results...");

const results = await allocationRepo.findByQuery({ contractId });

console.log("results length:", results.length);
```

---

## 10. Log Promise.all debugging

```ts
console.log("Start loading fulfillments");

const fulfillments = await Promise.all(
  allocationResults.map(async (r) => {
    console.log("processing:", r.id);
    return orderRepo.findByAllocationResultId(r.id);
  }),
);

console.log("done:", fulfillments);
```

---

## 11. Log blockchain / ethers.js

```ts
console.log("Generating externalId...");

const externalId = ethers.solidityPackedKeccak256(
  ["string", "uint256"],
  [contractId, chainId],
);

console.log("externalId:", externalId);
```

---

## 12. Log performance (optional)

```ts
console.time("create-contract");

await createContract();

console.timeEnd("create-contract");
```

---

## 13. Best practice trong project lớn

### ✔ Nên làm

- prefix context `[ServiceName]`
- log input/output rõ ràng
- log async steps
- log error đầy đủ stack

---

### ❌ Không nên làm

```ts
console.log("1");
console.log("ok");
```

→ không hiểu gì sau 5 phút

---

## 14. Khi nào KHÔNG dùng console.log

- production backend (nên dùng logger như Winston / Pino)
- sensitive data (password, private key)
- high-frequency loops

---

## 15. Upgrade recommendation

Nếu project lớn:

👉 thay `console.log` bằng:

- `winston`
- `pino`
- `nestjs logger`

---

## 🔥 Kết luận

`console.log` tốt khi:

- debug nhanh
- trace flow
- test async logic
- debug blockchain interaction

Nhưng phải:

> ✔ có context
> ✔ có structure
> ✔ không spam
