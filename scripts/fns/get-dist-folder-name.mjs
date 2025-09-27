export function getDistFolderName({ family, fill, grade, size, weight }) {
  return [
    //
    family.replace('material-symbols-', 'dist/'),
    fill ? 'fill' : '',
    grade === -25 ? 'gn25' : grade === 0 ? '' : 'g200',
    `s${size}`,
    `w${weight}`
  ]
    .filter(Boolean)
    .join('-')
}
