import {
  ExportSvg,
  FlagIDSVg,
  FlagUKSvg,
  GlobeSvg,
  ImportSvg,
  PaletteSvg,
  TrashSvg,
} from '@/assets'
import { Locales } from '@/types'
import { LOCALES } from '.'

type SettingMenu = {
  Icon: React.ElementType
  title: string
  className?: string
  iconClassName?: string
  titleClassName?: string
  link?: string
  callback?: () => void
}

type LanguageMenu = {
  Icon: React.ElementType
  title: string
  locales: Locales
}

export const SETTING_MENUS: SettingMenu[] = [
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

export const LANGUAGES_MENU: LanguageMenu[] = [
  {
    Icon: FlagUKSvg,
    title: 'English',
    locales: LOCALES.ENGLISH,
  },
  {
    Icon: FlagIDSVg,
    title: 'Indonesia',
    locales: LOCALES.INDONESIA,
  },
]
