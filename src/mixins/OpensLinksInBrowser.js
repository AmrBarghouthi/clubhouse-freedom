import { shell } from 'electron'

export default {
  methods: {
    openLinkInBrowser (link) {
      shell.openExternal(link)
    },
  },
}

