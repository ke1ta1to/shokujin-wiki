# タスク完了時のチェックリスト

## 必須チェック項目

1. **型チェック**

   ```bash
   pnpm check-types
   ```

   - TypeScriptの型エラーがないことを確認

2. **リンター実行（自動修正付き）**

   ```bash
   pnpm lint:fix
   ```

   - ESLintエラーを自動修正
   - import順序の自動整理
   - 型インポートの整理

3. **フォーマット実行**

   ```bash
   pnpm format
   ```

   - Prettierによるコード整形
   - 一貫したコードスタイルの維持

## 実行タイミング

- キリが良いタイミングで実行
- エラーが出ないタイミングで実行
- 全チェックでエラーがないことを確認して完了

## Gitコミット時

Huskyのpre-commitフックにより以下が自動実行:

1. `pnpm check-types`
2. `pnpm lint`
3. `pnpm format:check`

エラーがある場合はコミットがブロックされるため、事前に修正が必要
