type ValidationOptions<T> = {
  uniqueDataKey?: Array<keyof T>
  isRequired?: Array<keyof T>
}

export const validateForm = <T, E>(
  data: T,
  currentData: T[],
  setError: React.Dispatch<React.SetStateAction<E>>,
  options: ValidationOptions<T> = {}
): boolean => {
  let formIsValid = true

  // Validate required fields
  options.isRequired?.forEach((key) => {
    if (data[key] === '') {
      formIsValid = false
      setError((prevState) => ({
        ...prevState,
        [key]: 'This field cannot be empty',
      }))
    }
  })

  // Validate uniqueness
  options.uniqueDataKey?.forEach((key) => {
    if (
      currentData.some(
        (item) =>
          String(item[key]).trim().toLowerCase() ===
          String(data[key]).trim().toLowerCase()
      )
    ) {
      formIsValid = false
      setError((prevState) => ({
        ...prevState,
        [key]: `The ${String(key)} is already exist`,
      }))
    }
  })

  return formIsValid
}
