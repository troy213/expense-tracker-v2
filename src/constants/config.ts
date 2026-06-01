import {
  AdvancedSettingSvg,
  AlertCircleSvg,
  ExportSvg,
  FlagIDSVg,
  FlagUKSvg,
  GlobeSvg,
  ImportSvg,
  PaletteSvg,
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
  modal?: string
  disableChevron?: boolean
}

type LanguageMenu = {
  Icon: React.ElementType
  title: string
  locales: Locales
}

type SettingLayout = {
  title: string
  menus: SettingMenu[]
}

export const SETTING_MENUS: SettingLayout[] = [
  {
    title: 'DataManagement',
    menus: [
      {
        title: 'ImportData',
        Icon: ImportSvg,
        iconClassName: 'icon--stroke-primary',
        modal: 'ImportData',
      },
      {
        title: 'ExportData',
        Icon: ExportSvg,
        iconClassName: 'icon--stroke-primary',
        modal: 'ExportData',
      },
    ],
  },
  {
    title: 'AppearanceAndLanguage',
    menus: [
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
    ],
  },
  {
    title: 'Advanced',
    menus: [
      {
        title: 'AdvancedSetting',
        Icon: AdvancedSettingSvg,
        iconClassName: 'icon--stroke-primary',
        link: 'advanced-setting',
      },
    ],
  },
  {
    title: 'AboutAndLegal',
    menus: [
      {
        title: 'About',
        Icon: AlertCircleSvg,
        iconClassName: 'icon--stroke-primary',
        link: 'about',
      },
    ],
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

export const DEFAULT_EXPANDED_COUNT = 3
export const DEFAULT_VISIBLE_GROUPS = 3
