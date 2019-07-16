/**
 * Responsible for creating evaluator configuration for each traverser and deciding whether traversal and actions should be performed on each position accordingly.
 */
export const EvaluatorFunction = defaultParameter =>
  class Evaluator {
    constructor({ traverse = defaultParameter.traverse, process = defaultParameter.process } = {}) {
      this.traverse = traverse
      this.process = process
    }
    shouldContinue() {
      switch (this.traverse) {
        case 'continue':
          return true
          break
        case 'break':
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.traverse' = ${this.traverse}.`)
          break
      }
    }
    shouldIncludeResult() {
      switch (this.process) {
        case 'include':
          return true
          break
        case 'exclude':
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.process' = ${this.process}.`)
          break
      }
    }
    shouldExecuteProcess() {
      return this.shouldIncludeResult()
    }
  }
