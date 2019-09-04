import { evaluationOption } from '../graphModel/graphSchemeReference.js'
/**
 * Responsible for creating evaluator configuration for each traverser and deciding whether traversal and actions should be performed on each position accordingly.
 */
export const EvaluatorFunction = (defaultParameter = {}) =>
  class Evaluator {
    constructor({ propagation = defaultParameter.propagation, aggregation = defaultParameter.aggregation } = {}) {
      this.propagation = propagation
      this.aggregation = aggregation
    }
    shouldContinue() {
      switch (this.propagation) {
        case evaluationOption.propagation.continue:
          return true
          break
        case evaluationOption.propagation.break:
        case evaluationOption.propagation.hult:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.propagation' = ${this.propagation}.`)
          break
      }
    }
    shouldIncludeResult() {
      switch (this.aggregation) {
        case evaluationOption.aggregation.include:
          return true
          break
        case evaluationOption.aggregation.exclude:
        case evaluationOption.aggregation.skip:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.aggregation}.`)
          break
      }
    }
    shouldExecuteProcess() {
      switch (this.aggregation) {
        case evaluationOption.aggregation.include:
        case evaluationOption.aggregation.exclude:
          return true
          break
        case evaluationOption.aggregation.skip:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.aggregation}.`)
          break
      }
    }
  }
