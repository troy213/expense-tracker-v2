import {
  CoinsSvg,
  ExportSvg,
  GlobeSvg,
  ImportSvg,
  PaletteSvg,
  TrashSvg,
} from '@/assets'

type SettingMenu = {
  title: string
  titleClassName?: string
  className?: string
  Icon: React.ElementType
  iconClassName?: string
  link?: string
  callback?: () => void
}

export const SETTING_MENUS: SettingMenu[] = [
  {
    title: 'CategoryAndBudget',
    Icon: CoinsSvg,
    iconClassName: 'icon--fill-primary',
    link: '/categories',
  },
  {
    title: 'ImportData',
    Icon: ImportSvg,
    iconClassName: 'icon--stroke-primary',
    callback: () => {
      console.log('IMPORT')
    },
  },
  {
    title: 'ExportData',
    Icon: ExportSvg,
    iconClassName: 'icon--stroke-primary',
    callback: () => {
      console.log('EXPORT')
    },
  },
  {
    title: 'Theme',
    Icon: PaletteSvg,
    iconClassName: 'icon--stroke-primary',
    link: 'theme',
  },
  {
    title: 'Language',
    Icon: GlobeSvg,
    iconClassName: 'icon--stroke-primary',
    link: 'language',
  },
  {
    title: 'DeleteData',
    titleClassName: 'text--color-danger',
    Icon: TrashSvg,
    iconClassName: 'icon--stroke-danger',
    className: 'mt-6',
    callback: () => {
      console.log('DELETE DATA')
    },
  },
]
