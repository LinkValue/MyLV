import {
  HOLIDAY_CHANGE_STATUS_SUCCESS,
  HOLIDAY_DELETE_SUCCESS,
  HOLIDAY_DETAILS_FETCH_ERROR,
  HOLIDAY_DETAILS_FETCH_START,
  HOLIDAY_DETAILS_FETCH_SUCCESS,
  HOLIDAYS_FETCH_ERROR,
  HOLIDAYS_FETCH_START,
  HOLIDAYS_FETCH_SUCCESS,
  PERSONAL_HOLIDAYS_FETCH_ERROR, PERSONAL_HOLIDAYS_FETCH_START,
  PERSONAL_HOLIDAYS_FETCH_SUCCESS,
  PARTNER_HOLIDAYS_FETCH_SUCCESS,
  PARTNER_HOLIDAYS_FETCH_START,
} from './holidays.actions'

const initialState = {
  holidaysById: {},
  personalHolidays: [],
  isPersonalLoading: false,
  partnersHolidays: [],
  isPartnersHolidaysLoading: false,
  isUniqueLoading: false,
  limit: 25,
  pageCount: 0,
  partnerHolidays: [],
  isPartnerHolidaysLoading: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case PERSONAL_HOLIDAYS_FETCH_START:
      return {
        ...state,
        isPersonalLoading: true,
      }
    case PERSONAL_HOLIDAYS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          ...payload.results.reduce((acc, holiday) => ({ ...acc, [holiday.id]: holiday }), {}),
        },
        personalHolidays: payload.results.map(holiday => holiday.id),
        isPersonalLoading: false,
      }
    case PERSONAL_HOLIDAYS_FETCH_ERROR:
      return {
        ...state,
        isPersonalLoading: false,
      }
    case HOLIDAY_DELETE_SUCCESS: {
      const { [payload.id]: _, ...holidaysById } = state.holidaysById
      return {
        ...state,
        holidaysById,
        personalHolidays: state.personalHolidays.filter(holidayId => holidayId !== payload.id),
      }
    }
    case HOLIDAYS_FETCH_START:
      return {
        ...state,
        partnersHolidays: [],
        isPartnersHolidaysLoading: true,
        limit: payload.limit || state.limit,
      }
    case HOLIDAYS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          ...payload.results.reduce((acc, holiday) => ({ ...acc, [holiday.id]: holiday }), {}),
        },
        partnersHolidays: payload.results.map(holiday => holiday.id),
        isPartnersHolidaysLoading: false,
        pageCount: payload.pageCount,
      }
    case PARTNER_HOLIDAYS_FETCH_START:
      return {
        ...state,
        partnerHolidays: [],
        isPartnerHolidaysLoading: true,
      }
    case PARTNER_HOLIDAYS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          ...payload.results.reduce((acc, holiday) => ({ ...acc, [holiday.id]: holiday }), {}),
        },
        partnerHolidays: payload.results.map(holiday => holiday.id),
        isPartnerHolidaysLoading: false,
      }
    case HOLIDAYS_FETCH_ERROR:
      return {
        ...state,
        isPartnersHolidaysLoading: false,
      }
    case HOLIDAY_DETAILS_FETCH_START:
      return {
        ...state,
        isUniqueLoading: true,
      }
    case HOLIDAY_DETAILS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          [payload.id]: payload,
        },
        isUniqueLoading: false,
      }
    case HOLIDAY_DETAILS_FETCH_ERROR:
      return {
        ...state,
        isUniqueLoading: false,
      }
    case HOLIDAY_CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          [payload.id]: payload,
        },
      }
    default:
      return state
  }
}
