enum ReleaseNoteType {
  Breaking = 'breaking',
  Features = 'features',
  Fixes = 'fixes',
}

interface Release {
  version: string
  description?: string
  breaking?: string[]
  features?: string[]
  fixes?: string[]
}

const notes: Release[] = [
  {
    version: '1.1.0',
    description: 'Configuration by file',
    features: ['Allow configuration to be set in a file (#6). See [documentation](#configuration-file) for use.'],
  },
  {
    version: '1.0.1',
    description: 'Update dependencies',
    fixes: ['Update package dependencies (#5)'],
  },
  {
    version: '1.0.0',
    description: 'Initial public release.',
    features: ['Update NPM or Yarn projects (#1)'],
  },
]

export function getDescription({ version, build }: { version: string; build?: string }): string {
  const release: Release | undefined = notes.find((note) => note.version === version)
  if (!release) {
    throw Error(`The release notes do not contain a release for version "${version}": "${JSON.stringify(notes)}`)
  }
  let description = ''
  if (release.description) {
    description += `${release.description}\n\n---\n\n`
  }
  description += addReleaseNotesToDescription({
    release,
    type: ReleaseNoteType.Breaking,
  })
  description += addReleaseNotesToDescription({
    release,
    type: ReleaseNoteType.Features,
  })
  description += addReleaseNotesToDescription({
    release,
    type: ReleaseNoteType.Fixes,
  })
  if (build) {
    description += `---\n\nAdditional Information\n* Build: ${build}`
  }
  return description
}

function addReleaseNotesToDescription({ release, type }: { release: Release; type: ReleaseNoteType }): string {
  let description = ''
  const notes = release[type]
  if (notes && notes.length > 0) {
    if (type === ReleaseNoteType.Breaking) {
      description += '**Breaking Changes**\n'
    } else if (type === ReleaseNoteType.Features) {
      description += '**New Features**\n'
    } else if (type === ReleaseNoteType.Fixes) {
      description += '**Bug Fixes**\n'
    }
    for (const note of notes) {
      description += `* ${note}\n`
    }
    description += '\n'
  }
  return description
}
