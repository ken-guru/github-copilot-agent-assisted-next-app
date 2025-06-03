import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

type Operator = '+' | '-' | '×' | '÷'

interface CalculatorState {
  display: string
  previousValue: number | null
  operator: Operator | null
  waitingForOperand: boolean
  isError: boolean
}

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  isError: false,
}

export function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState)

  const calculate = (firstOperand: number, secondOperand: number, operator: Operator): number => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand
      case '-':
        return firstOperand - secondOperand
      case '×':
        return firstOperand * secondOperand
      case '÷':
        if (secondOperand === 0) {
          throw new Error('Division by zero')
        }
        return firstOperand / secondOperand
      default:
        return secondOperand
    }
  }

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.isError) {
        return {
          ...initialState,
          display: num === '0' ? '0' : num,
        }
      }

      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: num === '0' ? '0' : num,
          waitingForOperand: false,
        }
      }

      if (prevState.display === '0') {
        return {
          ...prevState,
          display: num,
        }
      }

      return {
        ...prevState,
        display: prevState.display + num,
      }
    })
  }, [])

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.isError) {
        return {
          ...initialState,
          display: '0.',
        }
      }

      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: '0.',
          waitingForOperand: false,
        }
      }

      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        }
      }

      return prevState
    })
  }, [])

  const clear = useCallback(() => {
    setState(initialState)
  }, [])

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
      isError: false,
    }))
  }, [])

  const performOperation = useCallback((nextOperator: Operator) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display)

      if (prevState.isError) {
        return {
          ...initialState,
          display: inputValue.toString(),
          previousValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
        }
      }

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
        }
      }

      if (prevState.operator && prevState.waitingForOperand) {
        return {
          ...prevState,
          operator: nextOperator,
        }
      }

      try {
        const result = calculate(prevState.previousValue, inputValue, prevState.operator!)
        return {
          ...prevState,
          display: result.toString(),
          previousValue: result,
          operator: nextOperator,
          waitingForOperand: true,
        }
      } catch (error) {
        return {
          ...prevState,
          display: 'Error',
          isError: true,
          previousValue: null,
          operator: null,
          waitingForOperand: false,
        }
      }
    })
  }, [])

  const performCalculation = useCallback(() => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display)

      if (prevState.isError || prevState.previousValue === null || !prevState.operator) {
        return prevState
      }

      try {
        const result = calculate(prevState.previousValue, inputValue, prevState.operator)
        return {
          ...prevState,
          display: result.toString(),
          previousValue: result,
          operator: null,
          waitingForOperand: true,
        }
      } catch (error) {
        return {
          ...prevState,
          display: 'Error',
          isError: true,
          previousValue: null,
          operator: null,
          waitingForOperand: false,
        }
      }
    })
  }, [])

  const backspace = useCallback(() => {
    setState(prevState => {
      if (prevState.isError || prevState.waitingForOperand) {
        return prevState
      }

      if (prevState.display.length > 1) {
        return {
          ...prevState,
          display: prevState.display.slice(0, -1),
        }
      }

      return {
        ...prevState,
        display: '0',
      }
    })
  }, [])

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key >= '0' && key <= '9') {
        event.preventDefault()
        inputNumber(key)
      } else if (key === '.') {
        event.preventDefault()
        inputDecimal()
      } else if (key === '+') {
        event.preventDefault()
        performOperation('+')
      } else if (key === '-') {
        event.preventDefault()
        performOperation('-')
      } else if (key === '*') {
        event.preventDefault()
        performOperation('×')
      } else if (key === '/') {
        event.preventDefault()
        performOperation('÷')
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault()
        performCalculation()
      } else if (key === 'Escape') {
        event.preventDefault()
        clear()
      } else if (key === 'Backspace') {
        event.preventDefault()
        backspace()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [inputNumber, inputDecimal, performOperation, performCalculation, clear, backspace])

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0']
  const operators: { symbol: Operator; label: string }[] = [
    { symbol: '÷', label: '÷' },
    { symbol: '×', label: '×' },
    { symbol: '-', label: '-' },
    { symbol: '+', label: '+' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto">
      <div className="mb-4">
        <div
          data-testid="calculator-display"
          aria-label="Calculator display"
          className={cn(
            'w-full h-16 px-4 py-2 text-right text-2xl font-mono bg-gray-100 dark:bg-gray-700',
            'border border-gray-300 dark:border-gray-600 rounded-lg',
            'overflow-hidden text-gray-900 dark:text-gray-100',
            state.isError && 'text-red-500'
          )}
        >
          {state.display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* First row - Clear, CE, and operations */}
        <Button
          variant="secondary"
          size="lg"
          onClick={clear}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
        >
          Clear
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={clearEntry}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          CE
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => performOperation('÷')}
          className={cn(
            'bg-orange-500 hover:bg-orange-600 text-white',
            state.operator === '÷' && state.waitingForOperand && 'bg-orange-700'
          )}
        >
          ÷
        </Button>

        {/* Number and operator buttons */}
        {[0, 1, 2].map(row => (
          <div key={row} className="contents">
            {numbers.slice(row * 3, row * 3 + 3).map(num => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                onClick={() => inputNumber(num)}
                className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => performOperation(operators[row].symbol)}
              className={cn(
                'bg-orange-500 hover:bg-orange-600 text-white',
                state.operator === operators[row].symbol && state.waitingForOperand && 'bg-orange-700'
              )}
            >
              {operators[row].label}
            </Button>
          </div>
        ))}

        {/* Bottom row - 0, decimal, equals */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => inputNumber('0')}
          className="col-span-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          0
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={inputDecimal}
          className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          .
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={performCalculation}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          =
        </Button>
      </div>
    </div>
  )
}
