export function getAssetsFileName({ family, fill, grade, size, weight }) {
  return [
    //
    family.replace('material-symbols-', 'src/assets/'),
    fill ? 'fill' : '',
    grade === -25 ? 'gn25' : grade === 0 ? '' : 'g200',
    `s${size}`,
    `w${weight}.ts`
  ]
    .filter(Boolean)
    .join('-')
}
