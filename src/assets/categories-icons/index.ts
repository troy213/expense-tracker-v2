import { CategoryIconId } from '@/types'
import CreditCardSvg from './categories_credit-card.svg?react'
import DonationsSvg from './categories_donations.svg?react'
import EducationsSvg from './categories_educations.svg?react'
import EntertainmentSvg from './categories_entertainment.svg?react'
import ExpenseSvg from './categories_expense.svg?react'
import FoodSvg from './categories_food.svg?react'
import GiftSvg from './categories_gift.svg?react'
import GymSvg from './categories_gym.svg?react'
import HealthSvg from './categories_health.svg?react'
import HousingSvg from './categories_housing.svg?react'
import IncomeSvg from './categories_income.svg?react'
import InsuranceSvg from './categories_insurance.svg?react'
import InvestmentSvg from './categories_investment.svg?react'
import PersonalCareSvg from './categories_personal-care.svg?react'
import PetsSvg from './categories_pets.svg?react'
import PhoneSvg from './categories_phone.svg?react'
import PriceTagSvg from './categories_price-tag.svg?react'
import SalarySvg from './categories_salary.svg?react'
import ScissorSvg from './categories_scissor.svg?react'
import ShoppingSvg from './categories_shopping.svg?react'
import SubscriptionSvg from './categories_subscription.svg?react'
import SuitcaseSvg from './categories_suitcase.svg?react'
import TaxSvg from './categories_tax.svg?react'
import TravelSvg from './categories_travel.svg?react'
import { ComponentType, SVGProps } from 'react'

export type CategoryIcon = {
  id: CategoryIconId
  component: ComponentType<SVGProps<SVGSVGElement>>
}

export const CATEGORY_ICONS: CategoryIcon[] = [
  { id: 'income', component: IncomeSvg },
  { id: 'expense', component: ExpenseSvg },
  { id: 'credit-card', component: CreditCardSvg },
  { id: 'donations', component: DonationsSvg },
  { id: 'educations', component: EducationsSvg },
  { id: 'entertainment', component: EntertainmentSvg },
  { id: 'food', component: FoodSvg },
  { id: 'gift', component: GiftSvg },
  { id: 'gym', component: GymSvg },
  { id: 'health', component: HealthSvg },
  { id: 'housing', component: HousingSvg },
  { id: 'insurance', component: InsuranceSvg },
  { id: 'investment', component: InvestmentSvg },
  { id: 'personal-care', component: PersonalCareSvg },
  { id: 'pets', component: PetsSvg },
  { id: 'phone', component: PhoneSvg },
  { id: 'price-tag', component: PriceTagSvg },
  { id: 'salary', component: SalarySvg },
  { id: 'scissor', component: ScissorSvg },
  { id: 'shopping', component: ShoppingSvg },
  { id: 'subscription', component: SubscriptionSvg },
  { id: 'suitcase', component: SuitcaseSvg },
  { id: 'tax', component: TaxSvg },
  { id: 'travel', component: TravelSvg },
]

export const ICON_COLORS = [
  '#133e5d',
  '#870805',
  '#055086',
  '#2d8705',
  '#e05b2b',
  '#2980b9',
  '#f39c12',
  '#8e44ad',
]

export const DEFAULT_INCOME_COLOR = ICON_COLORS[0]
export const DEFAULT_EXPENSE_COLOR = ICON_COLORS[1]
export const DEFAULT_MUTE_COLOR = '#9ca3af'

export const CATEGORY_ICONS_MAP: Record<
  CategoryIconId,
  ComponentType<SVGProps<SVGSVGElement>>
> = Object.fromEntries(
  CATEGORY_ICONS.map(({ id, component }) => [id, component])
) as Record<CategoryIconId, ComponentType<SVGProps<SVGSVGElement>>>
