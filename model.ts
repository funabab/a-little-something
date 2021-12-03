import fs from 'fs/promises'
import path from 'path'
import { IModel, IQuery, IQueryChange } from './types'

class Model<ModelType> implements IModel {
  protected modelPath: string

  constructor(modelPath: string) {
    this.modelPath = modelPath
  }

  async create(newData: ModelType) {
    const data = await fs.readFile(this.modelPath, { flag: 'a+' })
    let dataObj = JSON.parse(data.toString().trim() || '[]') as ModelType[]

    dataObj.push(newData)
    await fs.writeFile(this.modelPath, JSON.stringify(dataObj))

    return newData
  }

  async find(query: IQuery) {
    const data = await fs.readFile(this.modelPath, { flag: 'a+' })
    const dataObj = JSON.parse(data.toString().trim() || '[]') as ModelType[]

    const keys = Object.keys(query)

    if (!keys.length) {
      return dataObj
    }

    return dataObj.filter((obj) =>
      keys.every((key) => key in obj && (obj as any)[key] === query[key])
    )
  }

  async findFirst(query: IQuery) {
    const result = await this.find(query)
    return result[0]
  }

  async update(query: IQuery, change: IQueryChange) {
    const data = await fs.readFile(this.modelPath, { flag: 'a+' })
    let dataObj = JSON.parse(data.toString().trim() || '[]') as ModelType[]

    const keys = Object.keys(query)

    const changed: ModelType[] = []

    dataObj.map((obj) => {
      if (
        keys.length &&
        keys.every((key) => key in obj && (obj as any)[key] === query[key])
      ) {
        Object.keys(change).forEach(
          (changeKey) => ((obj as any)[changeKey] = change[changeKey])
        )
        changed.push(obj)
      }
      return obj
    })

    await fs.writeFile(this.modelPath, JSON.stringify(dataObj))
    return changed
  }

  async remove(query: IQuery) {
    const data = await fs.readFile(this.modelPath, { flag: 'a+' })
    const dataObj = JSON.parse(data.toString().trim() || '[]') as object[]

    const keys = Object.keys(query)

    if (!keys.length) {
      await fs.writeFile(this.modelPath, '[]')
      return
    }

    const filteredDataObj = dataObj.filter((obj) =>
      keys.every((key) => !(key in obj && (obj as any)[key] === query[key]))
    )

    await fs.writeFile(this.modelPath, JSON.stringify(filteredDataObj))
  }
}

export const loadModel = <ModelType>(model: string) => {
  const modelPath = path.join(__dirname, 'data', model)
  return new Model<ModelType>(modelPath)
}
