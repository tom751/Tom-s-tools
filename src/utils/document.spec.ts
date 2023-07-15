import { getDocumentFolderPath, getFileNameFromPath, getFileNameWithoutExtension } from './document'

describe('document utils', () => {
  describe('getDocumentFolderPath', () => {
    it('returns the path of the folder from a full file path', () => {
      const input = '/home/test/something/myFile.ts'
      const expected = '/home/test/something'

      const result = getDocumentFolderPath(input)
      expect(result).toEqual(expected)
    })
  })

  describe('getFileNameFromPath', () => {
    it('returns the file name from a path', () => {
      const input = '/home/test/something/myFile.ts'
      const expected = 'myFile.ts'

      const result = getFileNameFromPath(input)
      expect(result).toEqual(expected)
    })

    it('handles file names containing multiple dots', () => {
      const input = '/home/test/something/myFile.something.hey.ts'
      const expected = 'myFile.something.hey.ts'

      const result = getFileNameFromPath(input)
      expect(result).toEqual(expected)
    })
  })

  describe('getFileNameWithoutExtension', () => {
    it('returns the file name without an extension', () => {
      const input = 'myFile.ts'
      const expected = 'myFile'

      const result = getFileNameWithoutExtension(input)
      expect(result).toEqual(expected)
    })

    it('handles file names containing multiple dots', () => {
      const input = 'myFile.something.hey.ts'
      const expected = 'myFile.something.hey'

      const result = getFileNameWithoutExtension(input)
      expect(result).toEqual(expected)
    })
  })
})
