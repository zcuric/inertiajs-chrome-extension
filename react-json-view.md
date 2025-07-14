This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.github/
  workflows/
    ci.yml
  FUNDING.yml
.husky/
  pre-commit
core/
  src/
    arrow/
      TriangleArrow.test.tsx
      TriangleArrow.tsx
      TriangleSolidArrow.test.tsx
      TriangleSolidArrow.tsx
    comps/
      Copied.tsx
      KeyValues.tsx
      NestedClose.tsx
      NestedOpen.tsx
      useIdCompat.tsx
      Value.tsx
    editor/
      index.tsx
      KeyName.tsx
      store.tsx
    section/
      Copied.test.tsx
      Copied.tsx
      CountInfo.test.tsx
      CountInfo.tsx
      CountInfoExtra.test.tsx
      CountInfoExtra.tsx
      Ellipsis.test.tsx
      Ellipsis.tsx
      KeyName.test.tsx
      KeyName.tsx
      Row.tsx
    store/
      Expands.tsx
      Section.tsx
      ShowTools.tsx
      Symbols.tsx
      Types.tsx
    symbol/
      Arrow.test.tsx
      Arrow.tsx
      BraceLeft.test.tsx
      BraceLeft.tsx
      BraceRight.test.tsx
      BraceRight.tsx
      BracketsLeft.test.tsx
      BracketsLeft.tsx
      BracketsRight.test.tsx
      BracketsRight.tsx
      Colon.test.tsx
      Colon.tsx
      index.tsx
      Quote.test.tsx
      Quote.tsx
      ValueQuote.test.tsx
      ValueQuote.tsx
    theme/
      basic.test.ts
      basic.tsx
      dark.test.ts
      dark.ts
      github.dark.test.ts
      github.dark.tsx
      github.light.test.ts
      github.light.tsx
      gruvbox.test.ts
      gruvbox.tsx
      light.test.ts
      light.ts
      monokai.test.ts
      monokai.tsx
      nord.test.ts
      nord.tsx
      vscode.test.ts
      vscode.ts
    types/
      Bigint.tsx
      Date.test.tsx
      Date.tsx
      False.tsx
      Float.tsx
      index.test.tsx
      index.tsx
      Int.tsx
      Map.test.tsx
      Map.tsx
      Nan.test.tsx
      Nan.tsx
      Null.tsx
      Set.test.tsx
      Set.tsx
      String.test.tsx
      String.tsx
      True.tsx
      Undefined.tsx
      Url.test.tsx
      Url.tsx
    utils/
      useHighlight.test.tsx
      useHighlight.tsx
      useRender.tsx
    Container.test.tsx
    Container.tsx
    index.test.tsx
    index.tsx
    store.tsx
  basic.d.ts
  dark.d.ts
  editor.d.ts
  githubDark.d.ts
  githubLight.d.ts
  gruvbox.d.ts
  light.d.ts
  monokai.d.ts
  nord.d.ts
  package.json
  README.md
  triangle-arrow.d.ts
  triangle-solid-arrow.d.ts
  tsconfig.json
  vscode.d.ts
example/
  public/
    index.html
  src/
    demo.tsx
    index.tsx
  .kktrc.ts
  package.json
  README.md
  tsconfig.json
www/
  public/
    index.html
  src/
    example/
      default.tsx
      editor.tsx
    App.tsx
    index.tsx
    react-app-env.d.ts
  .kktrc.ts
  package.json
  tsconfig.json
.gitignore
.lintstagedrc
.prettierignore
.prettierrc
lerna.json
LICENSE
package.json
renovate.json
tsconfig.json
```

# Files

## File: .github/workflows/ci.yml
````yaml
name: CI
on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - run: node -v
      - run: npm -v
      - run: npm install
      - run: npm run type-check
      - run: npm run build
      - run: npm run coverage
      - run: npm run doc

      - name: Create Coverage Badges
        uses: jaywcjlove/coverage-badges-cli@main
        with:
          source: core/coverage/coverage-summary.json
          output: ./www/build/badges.svg

      - run: cp -rp core/coverage/lcov-report ./www/build/

      - name: Generate Contributors Images
        uses: jaywcjlove/github-action-contributors@main
        with:
          filter-author: (renovate\[bot\]|renovate-bot|dependabot\[bot\])
          output: www/build/CONTRIBUTORS.svg
          avatarSize: 42

      - name: Create Tag
        id: create_tag
        uses: jaywcjlove/create-tag-action@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          package-path: ./core/package.json

      - name: get tag version
        id: tag_version
        uses: jaywcjlove/changelog-generator@main

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          commit_message: ${{ github.event.head_commit.message }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./www/build

      - name: Generate Changelog
        id: changelog
        uses: jaywcjlove/changelog-generator@main
        with:
          head-ref: ${{steps.create_tag.outputs.version}}
          filter: '[R|r]elease[d]\s+[v|V]\d(\.\d+){0,2}'

      - name: Create Release
        uses: ncipollo/release-action@v1
        if: steps.create_tag.outputs.successful
        with:
          allowUpdates: true
          token: ${{ secrets.GITHUB_TOKEN }}
          name: ${{ steps.create_tag.outputs.version }}
          tag: ${{ steps.create_tag.outputs.version }}
          body: |
            [![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor) [![](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-json-view@${{steps.create_tag.outputs.versionNumber}}/file/README.md)

            Documentation ${{ steps.changelog.outputs.tag }}: https://raw.githack.com/uiwjs/react-json-view/${{ steps.changelog.outputs.gh-pages-short-hash }}/index.html
            Or Doc Website: https://htmlpreview.github.io/?https://github.com/uiwjs/react-json-view/${{ steps.changelog.outputs.gh-pages-short-hash }}/index.html
            Comparing Changes: ${{ steps.changelog.outputs.compareurl }}

            ```bash
            npm i @uiw/react-json-view@${{steps.create_tag.outputs.versionNumber}}
            ```

            ${{ steps.changelog.outputs.changelog }}

      - run: npm publish --access public --provenance
        name: 📦 @uiw/react-json-view publish to NPM
        continue-on-error: true
        working-directory: core
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## File: .github/FUNDING.yml
````yaml
ko_fi: jaywcjlove
buy_me_a_coffee: jaywcjlove
custom: ["https://www.paypal.me/kennyiseeyou", "https://jaywcjlove.github.io/#/sponsor"]
````

## File: .husky/pre-commit
````
npx --no-install lint-staged
````

## File: core/src/arrow/TriangleArrow.test.tsx
````typescript
import React from 'react';
import renderer from 'react-test-renderer';
import { TriangleArrow } from './TriangleArrow';

it('renders <TriangleArrow /> test case', () => {
  const component = renderer.create(<TriangleArrow />);
  let tree = component.toJSON();
  expect(tree).toHaveProperty('type');
  expect(tree).toHaveProperty('props');
  expect(tree).toHaveProperty('children');
  expect(tree).toHaveProperty('type', 'svg');
  expect(tree).toHaveProperty('props', {
    viewBox: '0 0 24 24',
    fill: 'var(--w-rjv-arrow-color, currentColor)',
    style: {
      cursor: 'pointer',
      height: '1em',
      width: '1em',
      display: 'inline-flex',
      userSelect: 'none',
    },
  });
});
````

## File: core/src/arrow/TriangleArrow.tsx
````typescript
import React from 'react';

export interface TriangleArrowProps extends React.SVGProps<SVGSVGElement> {}
export function TriangleArrow(props: TriangleArrowProps) {
  const { style, ...reset } = props;
  const defaultStyle: React.CSSProperties = {
    cursor: 'pointer',
    height: '1em',
    width: '1em',
    userSelect: 'none',
    display: 'inline-flex',
    ...style,
  };
  return (
    <svg viewBox="0 0 24 24" fill="var(--w-rjv-arrow-color, currentColor)" style={defaultStyle} {...reset}>
      <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
    </svg>
  );
}

TriangleArrow.displayName = 'JVR.TriangleArrow';
````

## File: core/src/arrow/TriangleSolidArrow.test.tsx
````typescript
import React from 'react';
import renderer from 'react-test-renderer';
import { TriangleSolidArrow } from './TriangleSolidArrow';

it('renders <TriangleSolidArrow /> test case', () => {
  const component = renderer.create(<TriangleSolidArrow />);
  let tree = component.toJSON();
  expect(tree).toHaveProperty('type');
  expect(tree).toHaveProperty('props');
  expect(tree).toHaveProperty('children');
  expect(tree).toHaveProperty('type', 'svg');
  expect(tree).toHaveProperty('props', {
    viewBox: '0 0 30 30',
    fill: 'var(--w-rjv-arrow-color, currentColor)',
    height: '1em',
    width: '1em',
    style: {
      cursor: 'pointer',
      height: '1em',
      width: '1em',
      display: 'flex',
      userSelect: 'none',
    },
  });
});
````

## File: core/src/arrow/TriangleSolidArrow.tsx
````typescript
import React from 'react';

export interface TriangleSolidArrowProps extends React.SVGProps<SVGSVGElement> {}
export function TriangleSolidArrow(props: TriangleSolidArrowProps) {
  const { style, ...reset } = props;
  const defaultStyle: React.CSSProperties = {
    cursor: 'pointer',
    height: '1em',
    width: '1em',
    userSelect: 'none',
    display: 'flex',
    ...style,
  };
  return (
    <svg
      viewBox="0 0 30 30"
      fill="var(--w-rjv-arrow-color, currentColor)"
      height="1em"
      width="1em"
      style={defaultStyle}
      {...reset}
    >
      <path d="M14.1758636,22.5690012 C14.3620957,22.8394807 14.6694712,23.001033 14.9978636,23.001033 C15.326256,23.001033 15.6336315,22.8394807 15.8198636,22.5690012 L24.8198636,9.56900125 C25.0322035,9.2633716 25.0570548,8.86504616 24.8843497,8.5353938 C24.7116447,8.20574144 24.3700159,7.99941506 23.9978636,8 L5.9978636,8 C5.62665,8.00153457 5.28670307,8.20817107 5.11443241,8.53699428 C4.94216175,8.86581748 4.96580065,9.26293681 5.1758636,9.56900125 L14.1758636,22.5690012 Z" />
    </svg>
  );
}

TriangleSolidArrow.displayName = 'JVR.TriangleSolidArrow';
````

## File: core/src/comps/Copied.tsx
````typescript
import { useState } from 'react';
import { useStore } from '../store';
import { useSectionStore, type SectionElementResult } from '../store/Section';
import { useShowToolsStore } from '../store/ShowTools';
import { type TagType } from '../store/Types';
import { bigIntToString } from '../types/';

export type CopiedOption<T extends object> = {
  value?: T;
  copied: boolean;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface CopiedProps<T extends object> extends React.SVGProps<SVGSVGElement>, SectionElementResult<T> {
  expandKey: string;
}

export const Copied = <T extends object, K extends TagType>(props: CopiedProps<T>) => {
  const { keyName, value, parentValue, expandKey, keys, ...other } = props;
  const { onCopied, enableClipboard } = useStore();
  const showTools = useShowToolsStore();
  const isShowTools = showTools[expandKey];
  const [copied, setCopied] = useState(false);
  const { Copied: Comp = {} } = useSectionStore();

  if (enableClipboard === false || !isShowTools) return null;

  const click = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    let copyText = '';
    if (typeof value === 'number' && value === Infinity) {
      copyText = 'Infinity';
    } else if (typeof value === 'number' && isNaN(value)) {
      copyText = 'NaN';
    } else if (typeof value === 'bigint') {
      copyText = bigIntToString(value);
    } else if (value instanceof Date) {
      copyText = value.toLocaleString();
    } else {
      copyText = JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? bigIntToString(v) : v), 2);
    }
    onCopied && onCopied(copyText, value);
    setCopied(true);

    const _clipboard = navigator.clipboard || {
      writeText(text: string) {
        return new Promise((reslove, reject) => {
          const textarea = document.createElement('textarea');
          textarea.style.position = 'absolute';
          textarea.style.opacity = '0';
          textarea.style.left = '-99999999px';
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          if (!document.execCommand('copy')) {
            reject();
          } else {
            reslove();
          }
          textarea.remove();
        });
      },
    };

    _clipboard
      .writeText(copyText)
      .then(() => {
        const timer = setTimeout(() => {
          setCopied(false);
          clearTimeout(timer);
        }, 3000);
      })
      .catch((error) => {});
  };
  const svgProps: React.SVGProps<SVGSVGElement> = {
    style: { display: 'inline-flex' },
    fill: copied ? 'var(--w-rjv-copied-success-color, #28a745)' : 'var(--w-rjv-copied-color, currentColor)',
    onClick: click,
  };
  const { as, render, ...reset } = Comp;

  const elmProps: React.SVGProps<SVGSVGElement> = {
    ...reset,
    ...other,
    ...svgProps,
    style: { ...reset.style, ...other.style, ...svgProps.style },
  } as React.SVGProps<SVGSVGElement>;
  const isRender = render && typeof render === 'function';
  const child =
    isRender &&
    render({ ...elmProps, 'data-copied': copied } as React.HTMLAttributes<K>, { value, keyName, keys, parentValue });
  if (child) return child;
  if (copied) {
    return (
      <svg viewBox="0 0 32 36" {...elmProps}>
        <path d="M27.5,33 L2.5,33 L2.5,12.5 L27.5,12.5 L27.5,15.2249049 C29.1403264,13.8627542 29.9736597,13.1778155 30,13.1700887 C30,11.9705278 30,10.0804982 30,7.5 C30,6.1 28.9,5 27.5,5 L20,5 C20,2.2 17.8,0 15,0 C12.2,0 10,2.2 10,5 L2.5,5 C1.1,5 0,6.1 0,7.5 L0,33 C0,34.4 1.1,36 2.5,36 L27.5,36 C28.9,36 30,34.4 30,33 L30,26.1114493 L27.5,28.4926435 L27.5,33 Z M7.5,7.5 L10,7.5 C10,7.5 12.5,6.4 12.5,5 C12.5,3.6 13.6,2.5 15,2.5 C16.4,2.5 17.5,3.6 17.5,5 C17.5,6.4 18.8,7.5 20,7.5 L22.5,7.5 C22.5,7.5 25,8.6 25,10 L5,10 C5,8.5 6.1,7.5 7.5,7.5 Z M5,27.5 L10,27.5 L10,25 L5,25 L5,27.5 Z M28.5589286,16 L32,19.6 L21.0160714,30.5382252 L13.5303571,24.2571429 L17.1303571,20.6571429 L21.0160714,24.5428571 L28.5589286,16 Z M17.5,15 L5,15 L5,17.5 L17.5,17.5 L17.5,15 Z M10,20 L5,20 L5,22.5 L10,22.5 L10,20 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 36" {...elmProps}>
      <path d="M27.5,33 L2.5,33 L2.5,12.5 L27.5,12.5 L27.5,20 L30,20 L30,7.5 C30,6.1 28.9,5 27.5,5 L20,5 C20,2.2 17.8,0 15,0 C12.2,0 10,2.2 10,5 L2.5,5 C1.1,5 0,6.1 0,7.5 L0,33 C0,34.4 1.1,36 2.5,36 L27.5,36 C28.9,36 30,34.4 30,33 L30,29 L27.5,29 L27.5,33 Z M7.5,7.5 L10,7.5 C10,7.5 12.5,6.4 12.5,5 C12.5,3.6 13.6,2.5 15,2.5 C16.4,2.5 17.5,3.6 17.5,5 C17.5,6.4 18.8,7.5 20,7.5 L22.5,7.5 C22.5,7.5 25,8.6 25,10 L5,10 C5,8.5 6.1,7.5 7.5,7.5 Z M5,27.5 L10,27.5 L10,25 L5,25 L5,27.5 Z M22.5,21.5 L22.5,16.5 L12.5,24 L22.5,31.5 L22.5,26.5 L32,26.5 L32,21.5 L22.5,21.5 Z M17.5,15 L5,15 L5,17.5 L17.5,17.5 L17.5,15 Z M10,20 L5,20 L5,22.5 L10,22.5 L10,20 Z" />
    </svg>
  );
};

Copied.displayName = 'JVR.Copied';
````

## File: core/src/comps/KeyValues.tsx
````typescript
import { Fragment, useRef } from 'react';
import { useStore } from '../store';
import { useExpandsStore } from '../store/Expands';
import { useShowToolsDispatch } from '../store/ShowTools';
import { Value } from './Value';
import { KeyNameComp } from '../section/KeyName';
import { RowComp } from '../section/Row';
import { Container } from '../Container';
import { Quote, Colon } from '../symbol/';
import { useHighlight } from '../utils/useHighlight';
import { type SectionElementResult } from '../store/Section';
import { Copied } from '../comps/Copied';
import { useIdCompat } from '../comps/useIdCompat';

interface KeyValuesProps<T extends object> extends SectionElementResult<T> {
  expandKey?: string;
  level: number;
}

export const KeyValues = <T extends object>(props: KeyValuesProps<T>) => {
  const { value, expandKey = '', level, keys = [] } = props;
  const expands = useExpandsStore();
  const { objectSortKeys, indentWidth, collapsed, shouldExpandNodeInitially } = useStore();
  const isMyArray = Array.isArray(value);
  const defaultExpanded =
    typeof collapsed === 'boolean' ? collapsed : typeof collapsed === 'number' ? level > collapsed : false;
  const isExpanded = expands[expandKey] ?? defaultExpanded;
  const shouldExpand = shouldExpandNodeInitially && shouldExpandNodeInitially(!isExpanded, { value, keys, level });
  if (expands[expandKey] === undefined && shouldExpandNodeInitially && !shouldExpand) {
    return null;
  }
  if (isExpanded) {
    return null;
  }
  // object
  let entries: [key: string | number, value: T][] = isMyArray
    ? Object.entries(value).map((m) => [Number(m[0]), m[1]])
    : Object.entries(value as T);
  if (objectSortKeys) {
    entries =
      objectSortKeys === true
        ? entries.sort(([a], [b]) => (typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) : 0))
        : entries.sort(([a, valA], [b, valB]) =>
            typeof a === 'string' && typeof b === 'string' ? objectSortKeys(a, b, valA, valB) : 0,
          );
  }

  const style = {
    borderLeft: 'var(--w-rjv-border-left-width, 1px) var(--w-rjv-line-style, solid) var(--w-rjv-line-color, #ebebeb)',
    paddingLeft: indentWidth,
    marginLeft: 6,
  };
  return (
    <div className="w-rjv-wrap" style={style}>
      {entries.map(([key, val], idx) => {
        return (
          <KeyValuesItem parentValue={value} keyName={key} keys={[...keys, key]} value={val} key={idx} level={level} />
        );
      })}
    </div>
  );
};

KeyValues.displayName = 'JVR.KeyValues';

interface KayNameProps<T extends object> extends Omit<KeyValuesProps<T>, 'level'> {}
export const KayName = <T extends object>(props: KayNameProps<T>) => {
  const { keyName, parentValue, keys, value } = props;
  const { highlightUpdates } = useStore();
  const isNumber = typeof keyName === 'number';
  const highlightContainer = useRef<HTMLSpanElement>(null);
  useHighlight({ value, highlightUpdates, highlightContainer });
  const compProps = { keyName, value, keys, parentValue };
  return (
    <Fragment>
      <span ref={highlightContainer}>
        <Quote isNumber={isNumber} data-placement="left" {...compProps} />
        <KeyNameComp {...compProps}>{keyName}</KeyNameComp>
        <Quote isNumber={isNumber} data-placement="right" {...compProps} />
      </span>
      <Colon {...compProps} />
    </Fragment>
  );
};

KayName.displayName = 'JVR.KayName';

export const KeyValuesItem = <T extends object>(props: KeyValuesProps<T>) => {
  const { keyName, value, parentValue, level = 0, keys = [] } = props;
  const dispatch = useShowToolsDispatch();
  const subkeyid = useIdCompat();
  const isMyArray = Array.isArray(value);
  const isMySet = value instanceof Set;
  const isMyMap = value instanceof Map;
  const isDate = value instanceof Date;
  const isUrl = value instanceof URL;
  const isMyObject = value && typeof value === 'object' && !isMyArray && !isMySet && !isMyMap && !isDate && !isUrl;
  const isNested = isMyObject || isMyArray || isMySet || isMyMap;
  if (isNested) {
    const myValue = isMySet ? Array.from(value as Set<any>) : isMyMap ? Object.fromEntries(value) : value;
    return (
      <Container
        keyName={keyName}
        value={myValue}
        parentValue={parentValue}
        initialValue={value}
        keys={keys}
        level={level + 1}
      />
    );
  }
  const reset: React.HTMLAttributes<HTMLDivElement> = {
    onMouseEnter: () => dispatch({ [subkeyid]: true }),
    onMouseLeave: () => dispatch({ [subkeyid]: false }),
  };
  return (
    <RowComp className="w-rjv-line" value={value} keyName={keyName} keys={keys} parentValue={parentValue} {...reset}>
      <KayName keyName={keyName} value={value} keys={keys} parentValue={parentValue} />
      <Value keyName={keyName!} value={value} />
      <Copied keyName={keyName} value={value as object} keys={keys} parentValue={parentValue} expandKey={subkeyid} />
    </RowComp>
  );
};

KeyValuesItem.displayName = 'JVR.KeyValuesItem';
````

## File: core/src/comps/NestedClose.tsx
````typescript
import { useStore } from '../store';
import { useExpandsStore } from '../store/Expands';
import { BracketsClose } from '../symbol/';

interface NestedCloseProps<T extends object> {
  value?: T;
  expandKey: string;
  level: number;
  keys?: (string | number)[];
}

export const NestedClose = <T extends object>(props: NestedCloseProps<T>) => {
  const { value, expandKey, level, keys = [] } = props;
  const expands = useExpandsStore();
  const isArray = Array.isArray(value);
  const { collapsed, shouldExpandNodeInitially } = useStore();
  const isMySet = value instanceof Set;
  const defaultExpanded =
    typeof collapsed === 'boolean' ? collapsed : typeof collapsed === 'number' ? level > collapsed : false;
  const isExpanded = expands[expandKey] ?? defaultExpanded;
  const len = Object.keys(value!).length;
  const shouldExpand = shouldExpandNodeInitially && shouldExpandNodeInitially(!isExpanded, { value, keys, level });
  if (expands[expandKey] === undefined && shouldExpandNodeInitially && !shouldExpand) {
    return null;
  }
  if (isExpanded || len === 0) {
    return null;
  }
  const style: React.CSSProperties = {
    paddingLeft: 4,
  };
  return (
    <div style={style}>
      <BracketsClose isBrackets={isArray || isMySet} isVisiable={true} />
    </div>
  );
};

NestedClose.displayName = 'JVR.NestedClose';
````

## File: core/src/comps/NestedOpen.tsx
````typescript
import { KayName } from './KeyValues';
import { useExpandsStore, useExpandsDispatch } from '../store/Expands';
import { useStore } from '../store';
import { Copied } from './Copied';
import { CountInfoExtraComps } from '../section/CountInfoExtra';
import { CountInfoComp } from '../section/CountInfo';
import { Arrow, BracketsOpen, BracketsClose } from '../symbol/';
import { EllipsisComp } from '../section/Ellipsis';
import { SetComp, MapComp } from '../types/';
import { type SectionElementResult } from '../store/Section';

export interface NestedOpenProps<T extends object> extends SectionElementResult<T> {
  initialValue?: T;
  expandKey: string;
  level: number;
}

export const NestedOpen = <T extends object>(props: NestedOpenProps<T>) => {
  const { keyName, expandKey, keys = [], initialValue, value, parentValue, level } = props;
  const expands = useExpandsStore();
  const dispatchExpands = useExpandsDispatch();
  const { onExpand, collapsed, shouldExpandNodeInitially } = useStore();
  const isArray = Array.isArray(value);
  const isMySet = value instanceof Set;
  const defaultExpanded =
    typeof collapsed === 'boolean' ? collapsed : typeof collapsed === 'number' ? level > collapsed : false;
  const isObject = typeof value === 'object';
  let isExpanded = expands[expandKey] ?? defaultExpanded;
  const shouldExpand = shouldExpandNodeInitially && shouldExpandNodeInitially(!isExpanded, { value, keys, level });
  if (expands[expandKey] === undefined && shouldExpandNodeInitially && !shouldExpand) {
    isExpanded = !shouldExpand;
  }
  const click = () => {
    const opt = { expand: !isExpanded, value, keyid: expandKey, keyName };
    onExpand && onExpand(opt);
    dispatchExpands({ [expandKey]: opt.expand });
  };

  const style: React.CSSProperties = { display: 'inline-flex', alignItems: 'center' };
  const arrowStyle = { transform: `rotate(${!isExpanded ? '0' : '-90'}deg)`, transition: 'all 0.3s' };
  const len = Object.keys(value!).length;
  const showArrow = len !== 0 && (isArray || isMySet || isObject);
  const reset: React.HTMLAttributes<HTMLDivElement> = { style };
  if (showArrow) {
    reset.onClick = click;
  }
  const compProps = { keyName, value, keys, parentValue };
  return (
    <span {...reset}>
      {showArrow && <Arrow style={arrowStyle} expandKey={expandKey} {...compProps} />}
      {(keyName || typeof keyName === 'number') && <KayName {...compProps} />}
      <SetComp value={initialValue} keyName={keyName!} />
      <MapComp value={initialValue} keyName={keyName!} />
      <BracketsOpen isBrackets={isArray || isMySet} {...compProps} />
      <EllipsisComp keyName={keyName!} value={value} isExpanded={isExpanded} />
      <BracketsClose isVisiable={isExpanded || !showArrow} isBrackets={isArray || isMySet} {...compProps} />
      <CountInfoComp value={value} keyName={keyName!} />
      <CountInfoExtraComps value={value} keyName={keyName!} />
      <Copied keyName={keyName!} value={value} expandKey={expandKey} parentValue={parentValue} keys={keys} />
    </span>
  );
};
NestedOpen.displayName = 'JVR.NestedOpen';
````

## File: core/src/comps/useIdCompat.tsx
````typescript
import { useRef } from 'react';

export function useIdCompat() {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = 'custom-id-' + Math.random().toString(36).substr(2, 9);
  }
  return idRef.current;
}
````

## File: core/src/comps/Value.tsx
````typescript
import {
  TypeString,
  TypeTrue,
  TypeNull,
  TypeFalse,
  TypeFloat,
  TypeBigint,
  TypeInt,
  TypeDate,
  TypeUndefined,
  TypeNan,
  TypeUrl,
} from '../types/';
export const isFloat = (n: number) => (Number(n) === n && n % 1 !== 0) || isNaN(n);

interface ValueProps {
  value: unknown;
  keyName: string | number;
}

export const Value = (props: ValueProps) => {
  const { value, keyName } = props;
  const reset = { keyName };
  if (value instanceof URL) {
    return <TypeUrl {...reset}>{value}</TypeUrl>;
  }
  if (typeof value === 'string') {
    return <TypeString {...reset}>{value}</TypeString>;
  }
  if (value === true) {
    return <TypeTrue {...reset}>{value}</TypeTrue>;
  }
  if (value === false) {
    return <TypeFalse {...reset}>{value}</TypeFalse>;
  }
  if (value === null) {
    return <TypeNull {...reset}>{value}</TypeNull>;
  }
  if (value === undefined) {
    return <TypeUndefined {...reset}>{value}</TypeUndefined>;
  }
  if (value instanceof Date) {
    return <TypeDate {...reset}>{value}</TypeDate>;
  }

  if (typeof value === 'number' && isNaN(value)) {
    return <TypeNan {...reset}>{value}</TypeNan>;
  } else if (typeof value === 'number' && isFloat(value)) {
    return <TypeFloat {...reset}>{value}</TypeFloat>;
  } else if (typeof value === 'bigint') {
    return <TypeBigint {...reset}>{value}</TypeBigint>;
  } else if (typeof value === 'number') {
    return <TypeInt {...reset}>{value}</TypeInt>;
  }

  return null;
};
Value.displayName = 'JVR.Value';
````

## File: core/src/editor/index.tsx
````typescript
import { forwardRef } from 'react';
import JsonView, { type JsonViewProps } from '../';
import { KeyNameRender } from './KeyName';
import { Context, Dispatch, useStoreReducer } from './store';

export interface JsonViewEditorProps<T extends object> extends Omit<JsonViewProps<T>, 'shortenTextAfterLength'> {
  /**
   * When a callback function is passed in, edit functionality is enabled. The callback is invoked before edits are completed.
   * @returns {boolean}  Returning false from onEdit will prevent the change from being made.
   */
  onEdit?: (option: {
    value: unknown;
    oldValue: unknown;
    keyName?: string | number;
    parentName?: string | number;
    type?: 'value' | 'key';
  }) => boolean;
  /** Whether enable edit feature. @default true */
  editable?: boolean;
}

const JsonViewEditor = forwardRef<HTMLDivElement, JsonViewEditorProps<object>>((props, ref) => {
  const { children, onEdit, editable = true, ...reset } = props;
  const [state, dispatch] = useStoreReducer({ onEdit });
  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>
        <JsonView {...reset} shortenTextAfterLength={0} ref={ref}>
          {editable && <JsonView.KeyName render={KeyNameRender} />}
          {children}
        </JsonView>
      </Dispatch.Provider>
    </Context.Provider>
  );
});

export default JsonViewEditor;
````

## File: core/src/editor/KeyName.tsx
````typescript
import { useRef, useState } from 'react';
import { type SectionElementProps } from '../store/Section';
import { useStore } from './store';
import { type SectionElementResult } from '../store/Section';

export const KeyNameRender: SectionElementProps['render'] = (
  { children, ...reset },
  { value, parentValue, keyName },
) => {
  if (typeof children === 'number') {
    return <span {...reset}>{children}</span>;
  }
  return (
    <Child {...reset} value={value} parentValue={parentValue} keyName={keyName}>
      {children}
    </Child>
  );
};

interface ChildProps<T extends object> extends React.HTMLAttributes<HTMLSpanElement>, SectionElementResult<T> {}

const Child = <T extends object>(props: ChildProps<T>) => {
  const { value, parentValue, keyName, ...reset } = props;
  const $dom = useRef<HTMLElement>(null);
  const [currentValue, setCurrentValue] = useState(props.children);
  const { onEdit } = useStore();

  const onKeyDown = (evn: React.KeyboardEvent<HTMLSpanElement>) => {
    if (evn.key === 'Enter') {
      $dom.current?.setAttribute('contentEditable', 'false');
    }
  };

  const onClick = (evn: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    evn.stopPropagation();
    $dom.current?.setAttribute('contentEditable', 'true');
    $dom.current?.focus();
  };

  const onBlur = (evn: React.FocusEvent<HTMLSpanElement, Element>) => {
    $dom.current?.setAttribute('contentEditable', 'false');
    const callback = onEdit && onEdit({ value: evn.target.textContent, oldValue: value, keyName });
    if (callback) {
      setCurrentValue(evn.target.textContent);
    }
  };

  const spanProps: React.HTMLAttributes<HTMLSpanElement> = {
    ...reset,
    onKeyDown,
    onClick,
    onBlur,
    spellCheck: false,
    contentEditable: 'false',
    suppressContentEditableWarning: true,
    children: currentValue,
  };

  return <span {...spanProps} ref={$dom} />;
};
````

## File: core/src/editor/store.tsx
````typescript
import { createContext, useContext, useReducer } from 'react';

type InitialState = {
  /**
   * When a callback function is passed in, edit functionality is enabled. The callback is invoked before edits are completed.
   * @returns {boolean}  Returning false from onEdit will prevent the change from being made.
   */
  onEdit?: (option: {
    value: unknown;
    oldValue: unknown;
    keyName?: string | number;
    parentName?: string | number;
    type?: 'value' | 'key';
  }) => boolean;
};
type Dispatch = React.Dispatch<InitialState>;

const initialState: InitialState = {};
export const Context = createContext<InitialState>(initialState);

const reducer = (state: InitialState, action: InitialState) => ({
  ...state,
  ...action,
});

export const Dispatch = createContext<Dispatch>(() => {});
Dispatch.displayName = 'JVR.Editor.Dispatch';

export const useStore = () => {
  return useContext(Context);
};

export function useStoreReducer(initialState: InitialState) {
  return useReducer(reducer, initialState);
}
````

## File: core/src/section/Copied.test.tsx
````typescript
import userEvent from '@testing-library/user-event';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import JsonView from '../';
import React from 'react';
import { act } from 'react';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const example = {
  avatar,
};
const exampleWithBigInt = {
  avatar,
  bigint: BigInt(1000),
};

// BigInt(1000) should render to '1000n'
const exampleWithBigIntAnswer = {
  avatar,
  bigint: BigInt(1000).toString() + 'n',
};

it('render <JsonView />, copy String test case', async () => {
  const user = userEvent.setup();
  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const divref = React.createRef<HTMLDivElement>();
  const { container } = render(
    <JsonView
      value={example}
      ref={divref}
      // onCopied={(copyText, value) => {
      //   console.log('>>>', copyText, value)
      // }}
    >
      <JsonView.Copied data-testid="copied" />
      <JsonView.CountInfo data-testid="countInfo" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  // await user.hover(container.lastElementChild!);
  fireEvent.mouseEnter(container.lastElementChild!);
  const copied = screen.getByTestId('copied');
  expect(copied.style).toHaveProperty('height', '1em');
  expect(copied.style).toHaveProperty('width', '1em');
  expect(copied.style).toHaveProperty('cursor', 'pointer');
  expect(copied.style).toHaveProperty('vertical-align', 'middle');
  expect(copied.style).toHaveProperty('margin-left', '5px');
  expect(copied.getAttribute('fill')).toEqual('var(--w-rjv-copied-color, currentColor)');
  expect(copied.tagName).toEqual('svg');
  await act(async () => {
    await user.click(copied);
  });
  expect(copied.getAttribute('fill')).toEqual('var(--w-rjv-copied-success-color, #28a745)');
  // Assertions
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(example, null, 2));
  await act(async () => {
    await user.unhover(container.lastElementChild!);
  });
  const countInfo = screen.getByTestId('countInfo');
  expect(countInfo.nextElementSibling).toBeNull();
  await waitFor(() => {
    expect(divref.current instanceof HTMLDivElement).toBeTruthy();
  });
  // Restore the original implementation
  jest.restoreAllMocks();
});

it('render <JsonView />, copy Number test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container } = render(
    <JsonView value={{ value: 123 }}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.Quote data-testid="quote" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const quote = screen.getAllByTestId('quote')[0];
  const lineDom = quote.parentElement?.parentElement!;
  fireEvent.mouseEnter(lineDom);
  const copied = screen.getAllByTestId('copied')[1];
  expect(copied.tagName).toEqual('svg');
  await waitFor(async () => {
    await user.click(copied);
  });
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');
  jest.restoreAllMocks();
});

it('render <JsonView.Copied />, copy Number test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container } = render(
    <JsonView value={{ value: 123 }}>
      <JsonView.Copied
        as="span"
        data-testid="copied"
        render={(props) => {
          return <span {...props}>xx</span>;
        }}
      />
      <JsonView.Quote data-testid="quote" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const quote = screen.getAllByTestId('quote')[0];
  const lineDom = quote.parentElement?.parentElement!;
  fireEvent.mouseEnter(lineDom);
  const copied = screen.getAllByTestId('copied')[1];
  expect(copied.tagName).toEqual('SPAN');
  expect(copied.innerHTML).toEqual('xx');
  await waitFor(async () => {
    await user.click(copied);
  });
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');
  jest.restoreAllMocks();
});

it('render <JsonView.Copied />, copy NaN test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container } = render(
    <JsonView value={{ value: NaN }}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.Quote data-testid="quote" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const quote = screen.getAllByTestId('quote')[0];
  const lineDom = quote.parentElement?.parentElement!;
  fireEvent.mouseEnter(lineDom);
  const copied = screen.getAllByTestId('copied')[1];
  await waitFor(async () => {
    await user.click(copied);
  });
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('NaN');
  jest.restoreAllMocks();
});

it('render <JsonView.Copied />, copy Infinity test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container } = render(
    <JsonView value={{ value: Infinity }}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.Quote data-testid="quote" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const quote = screen.getAllByTestId('quote')[0];
  const lineDom = quote.parentElement?.parentElement!;
  fireEvent.mouseEnter(lineDom);
  const copied = screen.getAllByTestId('copied')[1];
  await waitFor(async () => {
    await user.click(copied);
  });
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Infinity');
  jest.restoreAllMocks();
});

it('render <JsonView.Copied />, copy BigInt test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container, debug } = render(
    <JsonView value={{ value: BigInt(1000) }}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.Quote data-testid="quote" />
      <JsonView.Bigint data-testid="bigint" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const quote = screen.getAllByTestId('quote')[0];
  const lineDom = quote.parentElement?.parentElement!;
  fireEvent.mouseEnter(lineDom);
  const copied = screen.getAllByTestId('copied')[1];
  await waitFor(async () => {
    await user.click(copied);
  });
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1000n');
  fireEvent.mouseLeave(lineDom);
  const bigint = screen.getAllByTestId('bigint')[1];
  expect(bigint.nextElementSibling).toBeNull();
  jest.restoreAllMocks();
});

it('render <JsonView.Copied />, copy Object with BigInt test case', async () => {
  const user = userEvent.setup();

  // Mock the necessary functions and values
  const writeTextMock = jest.fn().mockResolvedValue(undefined);
  jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
  const { container, debug } = render(
    <JsonView value={exampleWithBigInt}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.CountInfo data-testid="countInfo" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  fireEvent.mouseEnter(container.lastElementChild!);
  const copied = screen.getByTestId('copied');
  await waitFor(async () => {
    await user.click(copied);
  });
  // Assertions
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(exampleWithBigIntAnswer, null, 2));
  await waitFor(async () => {
    await user.unhover(container.lastElementChild!);
  });
  // Restore the original implementation
  jest.restoreAllMocks();
});
````

## File: core/src/section/Copied.tsx
````typescript
import { type TagType } from '../store/Types';
import { type SectionElement, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';

export const Copied = <K extends TagType = 'svg'>(props: SectionElement<K>) => {
  const { Copied: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'Copied');
  return null;
};

Copied.displayName = 'JVR.Copied';
````

## File: core/src/section/CountInfo.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '../';
import React from 'react';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const example = {
  avatar,
};

it('renders <JsonView.CountInfo /> test case', async () => {
  const { container } = render(
    <JsonView value={example}>
      <JsonView.CountInfo data-testid="countInfo" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const copied = screen.getByTestId('countInfo');
  expect(copied.className).toEqual('w-rjv-object-size');
  expect(copied.style).toHaveProperty('padding-left', '8px');
  expect(copied.style).toHaveProperty('font-style', 'italic');
});

it('renders <JsonView.CountInfo /> test case', async () => {
  const { container } = render(
    <JsonView value={example}>
      <JsonView.CountInfo
        data-testid="countInfo"
        render={(props) => {
          return <span {...props}>xxx</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const copied = screen.getByTestId('countInfo');
  expect(copied.className).toEqual('w-rjv-object-size');
  expect(copied.style).toHaveProperty('padding-left', '8px');
  expect(copied.style).toHaveProperty('font-style', 'italic');
});

it('renders <JsonView.CountInfo /> displayObjectSize test case', async () => {
  const { container } = render(
    <JsonView value={example} displayObjectSize={false}>
      <JsonView.CountInfo data-testid="countInfo" />
      <JsonView.BraceLeft data-testid="brace" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const brace = screen.getByTestId('brace');
  expect(brace.nextElementSibling).toBeNull();
});
````

## File: core/src/section/CountInfo.tsx
````typescript
import { type TagType } from '../store/Types';
import { type SectionElement, type SectionElementProps, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';
import { useStore } from '../store';

export const CountInfo = <K extends TagType>(props: SectionElement<K>) => {
  const { CountInfo: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'CountInfo');
  return null;
};

CountInfo.displayName = 'JVR.CountInfo';

export interface CountInfoCompProps<T extends object> {
  value?: T;
  keyName: string | number;
}

export const CountInfoComp = <K extends TagType, T extends object>(
  props: SectionElementProps<K> & CountInfoCompProps<T> & React.HTMLAttributes<HTMLElement>,
) => {
  const { value = {}, keyName, ...other } = props;
  const { displayObjectSize } = useStore();

  const { CountInfo: Comp = {} } = useSectionStore();

  if (!displayObjectSize) return null;

  const { as, render, ...reset } = Comp;
  const Elm = as || 'span';

  reset.style = { ...reset.style, ...props.style };

  const len = Object.keys(value).length;
  if (!reset.children) {
    reset.children = `${len} item${len === 1 ? '' : 's'}`;
  }

  const elmProps = { ...reset, ...other };
  const isRender = render && typeof render === 'function';
  const child = isRender && render({ ...elmProps, 'data-length': len } as React.HTMLAttributes<K>, { value, keyName });
  if (child) return child;
  return <Elm {...elmProps} />;
};

CountInfoComp.displayName = 'JVR.CountInfoComp';
````

## File: core/src/section/CountInfoExtra.test.tsx
````typescript
import { screen, render } from '@testing-library/react';
import JsonView from '../';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const example = {
  avatar,
};

it('renders <JsonView.CountInfoExtra /> test case', async () => {
  const { container } = render(
    <JsonView value={example}>
      <JsonView.CountInfoExtra data-testid="countInfo">xx</JsonView.CountInfoExtra>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const countInfo = screen.getByTestId('countInfo');
  expect(countInfo.className).toEqual('w-rjv-object-extra');
  expect(countInfo.style).toHaveProperty('padding-left', '8px');
});

it('renders <JsonView.CountInfoExtra /> test case', async () => {
  const { container, debug } = render(
    <JsonView value={example}>
      <JsonView.CountInfoExtra
        data-testid="countInfo"
        render={(props) => {
          return <span {...props}>xx</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const countInfo = screen.getByTestId('countInfo');
  expect(countInfo.className).toEqual('w-rjv-object-extra');
  expect(countInfo.style).toHaveProperty('padding-left', '8px');
  expect(countInfo.innerHTML).toEqual('xx');
});
````

## File: core/src/section/CountInfoExtra.tsx
````typescript
import { type TagType } from '../store/Types';
import { type SectionElement, type SectionElementProps, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';

export const CountInfoExtra = <K extends TagType>(props: SectionElement<K>) => {
  const { CountInfoExtra: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'CountInfoExtra');
  return null;
};

CountInfoExtra.displayName = 'JVR.CountInfoExtra';

export interface CountInfoExtraCompsProps<T extends object> {
  value?: T;
  keyName: string | number;
}

export const CountInfoExtraComps = <T extends object, K extends TagType>(
  props: SectionElementProps<K> & CountInfoExtraCompsProps<T>,
) => {
  const { value = {}, keyName, ...other } = props;
  const { CountInfoExtra: Comp = {} } = useSectionStore();
  const { as, render, ...reset } = Comp;
  if (!render && !reset.children) return null;
  const Elm = as || 'span';
  const isRender = render && typeof render === 'function';
  const elmProps = { ...reset, ...other };
  const child = isRender && render(elmProps as React.HTMLAttributes<K>, { value, keyName });
  if (child) return child;
  return <Elm {...elmProps} />;
};

CountInfoExtraComps.displayName = 'JVR.CountInfoExtraComps';
````

## File: core/src/section/Ellipsis.test.tsx
````typescript
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '../';
import { Ellipsis } from './Ellipsis';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const example = {
  avatar,
};

it('renders <JsonView.Ellipsis /> test case', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <JsonView value={example}>
      <Ellipsis
        as="span"
        data-testid="ellipsis"
        render={(props) => {
          expect(props.children).toEqual('...');
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-ellipsis-color, #cb4b16)');
          return <span {...props} />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await act(async () => {
    await user.click(container.lastElementChild?.firstElementChild!);
    await waitFor(() => {
      const ellipsis = screen.getByTestId('ellipsis');
      expect(ellipsis.className).toEqual('w-rjv-ellipsis');
      expect(ellipsis.style).toHaveProperty('cursor', 'pointer');
      expect(ellipsis.style).toHaveProperty('user-select', 'none');
      expect(ellipsis.innerHTML).toEqual('...');
    });
  });
});

it('renders <JsonView.Ellipsis /> children test case', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <JsonView value={example}>
      <Ellipsis as="span" data-testid="ellipsis">
        xxx
      </Ellipsis>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await act(async () => {
    await user.click(container.lastElementChild?.firstElementChild!);
  });
  await waitFor(() => {
    const ellipsis = screen.getByTestId('ellipsis');
    expect(ellipsis.innerHTML).toEqual('xxx');
  });
});
````

## File: core/src/section/Ellipsis.tsx
````typescript
import { type TagType } from '../store/Types';
import { type SectionElement, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';

export const Ellipsis = <K extends TagType>(props: SectionElement<K>) => {
  const { Ellipsis: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'Ellipsis');
  return null;
};

Ellipsis.displayName = 'JVR.Ellipsis';

export interface EllipsisCompProps<T extends object> {
  value?: T;
  keyName: string | number;
  isExpanded: boolean;
}

export const EllipsisComp = <T extends object>({ isExpanded, value, keyName }: EllipsisCompProps<T>) => {
  const { Ellipsis: Comp = {} } = useSectionStore();
  const { as, render, ...reset } = Comp;
  const Elm = as || 'span';
  const child =
    render && typeof render === 'function' && render({ ...reset, 'data-expanded': isExpanded }, { value, keyName });
  if (child) return child;

  if (!isExpanded || (typeof value === 'object' && Object.keys(value).length == 0)) return null;
  return <Elm {...reset} />;
};

EllipsisComp.displayName = 'JVR.EllipsisComp';
````

## File: core/src/section/KeyName.test.tsx
````typescript
import userEvent from '@testing-library/user-event';
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '../';
import { KeyName } from './KeyName';

const example = {
  value: 'test2',
};

it('renders <JsonView.KeyName /> test case', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <JsonView value={example}>
      <KeyName
        as="span"
        data-testid="keyName"
        render={(props) => {
          expect(props.children).toEqual('value');
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-key-string, #002b36)');
          return <span {...props} />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const keyName = screen.getByTestId('keyName');
    expect(keyName.className).toEqual('w-rjv-object-key');
  });
});
````

## File: core/src/section/KeyName.tsx
````typescript
import { type PropsWithChildren } from 'react';
import { type TagType } from '../store/Types';
import { type SectionElement, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';
import { type SectionElementResult } from '../store/Section';

export const KeyName = <K extends TagType>(props: SectionElement<K>) => {
  const { KeyName: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'KeyName');
  return null;
};

KeyName.displayName = 'JVR.KeyName';

export interface KeyNameCompProps<T extends object>
  extends React.HTMLAttributes<HTMLSpanElement>,
    SectionElementResult<T> {}

export const KeyNameComp = <T extends object>(props: PropsWithChildren<KeyNameCompProps<T>>) => {
  const { children, value, parentValue, keyName, keys } = props;
  const isNumber = typeof children === 'number';
  const style: React.CSSProperties = {
    color: isNumber ? 'var(--w-rjv-key-number, #268bd2)' : 'var(--w-rjv-key-string, #002b36)',
  };
  const { KeyName: Comp = {} } = useSectionStore();
  const { as, render, ...reset } = Comp;
  reset.style = { ...reset.style, ...style };
  const Elm = as || 'span';
  const child =
    render &&
    typeof render === 'function' &&
    render({ ...reset, children }, { value, parentValue, keyName, keys: keys || (keyName ? [keyName] : []) });
  if (child) return child;
  return <Elm {...reset}>{children}</Elm>;
};

KeyNameComp.displayName = 'JVR.KeyNameComp';
````

## File: core/src/section/Row.tsx
````typescript
import { type TagType } from '../store/Types';
import { type SectionElement, useSectionStore } from '../store/Section';
import { useSectionRender } from '../utils/useRender';
import { type SectionElementResult } from '../store/Section';

export const Row = <K extends TagType>(props: SectionElement<K>) => {
  const { Row: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'Row');
  return null;
};

Row.displayName = 'JVR.Row';

export interface RowCompProps<T extends object> extends React.HTMLAttributes<HTMLDivElement>, SectionElementResult<T> {}

export const RowComp = <T extends object>(props: React.PropsWithChildren<RowCompProps<T>>) => {
  const { children, value, parentValue, keyName, keys, ...other } = props;
  const { Row: Comp = {} } = useSectionStore();
  const { as, render, children: _, ...reset } = Comp;
  const Elm = as || 'div';
  const child =
    render &&
    typeof render === 'function' &&
    render({ ...other, ...reset, children }, { value, keyName, parentValue, keys });
  if (child) return child;
  return (
    <Elm {...other} {...reset}>
      {children}
    </Elm>
  );
};

RowComp.displayName = 'JVR.RowComp';
````

## File: core/src/store/Expands.tsx
````typescript
import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';

type InitialState = {
  [key: string]: boolean;
};

type Dispatch = React.Dispatch<InitialState>;

const initialState: InitialState = {};
const Context = createContext<InitialState>(initialState);

const reducer = (state: InitialState, action: InitialState) => ({
  ...state,
  ...action,
});

export const useExpandsStore = () => {
  return useContext(Context);
};

const DispatchExpands = createContext<Dispatch>(() => {});
DispatchExpands.displayName = 'JVR.DispatchExpands';

export function useExpands() {
  return useReducer(reducer, initialState);
}

export function useExpandsDispatch() {
  return useContext(DispatchExpands);
}

interface ExpandsProps {
  initial: InitialState;
  dispatch: Dispatch;
}

export const Expands: FC<PropsWithChildren<ExpandsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchExpands.Provider value={dispatch}>{children}</DispatchExpands.Provider>
    </Context.Provider>
  );
};
Expands.displayName = 'JVR.Expands';
````

## File: core/src/store/Section.tsx
````typescript
import React, { FC, PropsWithChildren, ComponentPropsWithoutRef, createContext, useContext, useReducer } from 'react';
import { type TagType } from './Types';

export interface SectionElementResult<T extends object, K = string | number> {
  value?: T;
  parentValue?: T;
  keyName?: K;
  /** Index of the parent `keyName` */
  keys?: K[];
}

export type SectionElementProps<T extends TagType = 'span'> = {
  as?: T;
  render?: (props: SectionElement<T>, result: SectionElementResult<object>) => React.ReactNode;
};

export type SectionElement<T extends TagType = 'span'> = SectionElementProps<T> & ComponentPropsWithoutRef<T>;

type InitialState<T extends TagType> = {
  Copied?: SectionElement<T>;
  CountInfo?: SectionElement<T>;
  CountInfoExtra?: SectionElement<T>;
  Ellipsis?: SectionElement<T>;
  Row?: SectionElement<T>;
  KeyName?: SectionElement<T>;
};

type Dispatch = React.Dispatch<InitialState<TagType>>;
const initialState: InitialState<TagType> = {
  Copied: {
    className: 'w-rjv-copied',
    style: {
      height: '1em',
      width: '1em',
      cursor: 'pointer',
      verticalAlign: 'middle',
      marginLeft: 5,
    },
  },
  CountInfo: {
    as: 'span',
    className: 'w-rjv-object-size',
    style: {
      color: 'var(--w-rjv-info-color, #0000004d)',
      paddingLeft: 8,
      fontStyle: 'italic',
    },
  },
  CountInfoExtra: {
    as: 'span',
    className: 'w-rjv-object-extra',
    style: {
      paddingLeft: 8,
    },
  },
  Ellipsis: {
    as: 'span',
    style: {
      cursor: 'pointer',
      color: 'var(--w-rjv-ellipsis-color, #cb4b16)',
      userSelect: 'none',
    },
    className: 'w-rjv-ellipsis',
    children: '...',
  },
  Row: {
    as: 'div',
    className: 'w-rjv-line',
  },
  KeyName: {
    as: 'span',
    className: 'w-rjv-object-key',
  },
};

const Context = createContext<InitialState<TagType>>(initialState);
const reducer = (state: InitialState<TagType>, action: InitialState<TagType>) => ({
  ...state,
  ...action,
});

export const useSectionStore = () => {
  return useContext(Context);
};

const DispatchSection = createContext<Dispatch>(() => {});
DispatchSection.displayName = 'JVR.DispatchSection';

export function useSection() {
  return useReducer(reducer, initialState);
}

export function useSectionDispatch() {
  return useContext(DispatchSection);
}

interface SectionProps {
  initial: InitialState<TagType>;
  dispatch: Dispatch;
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchSection.Provider value={dispatch}>{children}</DispatchSection.Provider>
    </Context.Provider>
  );
};

Section.displayName = 'JVR.Section';
````

## File: core/src/store/ShowTools.tsx
````typescript
import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';

type InitialState = Record<string, boolean>;
type Dispatch = React.Dispatch<InitialState>;

const initialState: InitialState = {};
const Context = createContext<InitialState>(initialState);

const reducer = (state: InitialState, action: InitialState) => ({
  ...state,
  ...action,
});

export const useShowToolsStore = () => {
  return useContext(Context);
};

const DispatchShowTools = createContext<Dispatch>(() => {});
DispatchShowTools.displayName = 'JVR.DispatchShowTools';

export function useShowTools() {
  return useReducer(reducer, initialState);
}

export function useShowToolsDispatch() {
  return useContext(DispatchShowTools);
}

interface ShowToolsProps {
  initial: InitialState;
  dispatch: Dispatch;
}

export const ShowTools: FC<PropsWithChildren<ShowToolsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchShowTools.Provider value={dispatch}>{children}</DispatchShowTools.Provider>
    </Context.Provider>
  );
};
ShowTools.displayName = 'JVR.ShowTools';
````

## File: core/src/store/Symbols.tsx
````typescript
import {
  FC,
  PropsWithChildren,
  ElementType,
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { type TagType } from './Types';
import { TriangleArrow } from '../arrow/TriangleArrow';

export interface SymbolsElementResult<T extends object, K = string | number> {
  value?: T;
  parentValue?: T;
  keyName?: K;
  /** Index of the parent `keyName` */
  keys?: K[];
}

type SymbolsElementProps<T extends TagType = 'span'> = {
  as?: T;
  render?: (props: SymbolsElement<T>, result: SymbolsElementResult<object>) => React.ReactNode;
  'data-type'?: string;
};
export type SymbolsElement<T extends TagType = 'span'> = SymbolsElementProps<T> & ComponentPropsWithoutRef<T>;

type InitialState<T extends ElementType = 'span'> = {
  Arrow?: SymbolsElement<T>;
  Colon?: SymbolsElement<T>;
  Quote?: SymbolsElement<T>;
  ValueQuote?: SymbolsElement<T>;
  BracketsRight?: SymbolsElement<T>;
  BracketsLeft?: SymbolsElement<T>;
  BraceRight?: SymbolsElement<T>;
  BraceLeft?: SymbolsElement<T>;
};

type Dispatch = React.Dispatch<InitialState<TagType>>;
const initialState: InitialState<TagType> = {
  Arrow: {
    as: 'span',
    className: 'w-rjv-arrow',
    style: {
      transform: 'rotate(0deg)',
      transition: 'all 0.3s',
    },
    children: <TriangleArrow />,
  },
  Colon: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-colon-color, var(--w-rjv-color))',
      marginLeft: 0,
      marginRight: 2,
    },
    className: 'w-rjv-colon',
    children: ':',
  },
  Quote: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-quotes-color, #236a7c)',
    },
    className: 'w-rjv-quotes',
    children: '"',
  },
  ValueQuote: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-quotes-string-color, #cb4b16)',
    },
    className: 'w-rjv-quotes',
    children: '"',
  },
  BracketsLeft: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-brackets-color, #236a7c)',
    },
    className: 'w-rjv-brackets-start',
    children: '[',
  },
  BracketsRight: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-brackets-color, #236a7c)',
    },
    className: 'w-rjv-brackets-end',
    children: ']',
  },
  BraceLeft: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-curlybraces-color, #236a7c)',
    },
    className: 'w-rjv-curlybraces-start',
    children: '{',
  },
  BraceRight: {
    as: 'span',
    style: {
      color: 'var(--w-rjv-curlybraces-color, #236a7c)',
    },
    className: 'w-rjv-curlybraces-end',
    children: '}',
  },
};

const Context = createContext<InitialState<TagType>>(initialState);
const reducer = (state: InitialState<TagType>, action: InitialState<TagType>) => ({
  ...state,
  ...action,
});

export const useSymbolsStore = () => {
  return useContext(Context);
};

const DispatchSymbols = createContext<Dispatch>(() => {});
DispatchSymbols.displayName = 'JVR.DispatchSymbols';

export function useSymbols() {
  return useReducer(reducer, initialState);
}

export function useSymbolsDispatch() {
  return useContext(DispatchSymbols);
}

interface SymbolsProps {
  initial: InitialState<TagType>;
  dispatch: Dispatch;
}

export const Symbols: FC<PropsWithChildren<SymbolsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchSymbols.Provider value={dispatch}>{children}</DispatchSymbols.Provider>
    </Context.Provider>
  );
};

Symbols.displayName = 'JVR.Symbols';
````

## File: core/src/store/Types.tsx
````typescript
import { PropsWithChildren, ComponentPropsWithoutRef, createContext, useContext, useReducer } from 'react';
export type TagType = React.ElementType | keyof JSX.IntrinsicElements;

type TypesElementProps<T extends TagType = 'span'> = {
  as?: T;
  render?: (
    props: TypesElement<T>,
    result: { type: 'type' | 'value'; value?: unknown; keyName: string | number },
  ) => React.ReactNode;
  'data-type'?: string;
};

export type TypesElement<T extends TagType> = TypesElementProps<T> & ComponentPropsWithoutRef<T>;
export type InitialTypesState<T extends TagType = 'span'> = {
  displayDataTypes?: boolean;
  Url?: TypesElement<T>;
  Str?: TypesElement<T>;
  Undefined?: TypesElement<T>;
  Null?: TypesElement<T>;
  True?: TypesElement<T>;
  False?: TypesElement<T>;
  Date?: TypesElement<T>;
  Float?: TypesElement<T>;
  Set?: TypesElement<T>;
  Int?: TypesElement<T>;
  Map?: TypesElement<T>;
  Nan?: TypesElement<T>;
  Bigint?: TypesElement<T>;
};
type Dispatch<T extends TagType> = React.Dispatch<InitialTypesState<T>>;

const initialState: InitialTypesState<TagType | 'span'> = {
  Str: {
    as: 'span',
    'data-type': 'string',
    style: {
      color: 'var(--w-rjv-type-string-color, #cb4b16)',
    },
    className: 'w-rjv-type',
    children: 'string',
  },
  Url: {
    as: 'a',
    style: {
      color: 'var(--w-rjv-type-url-color, #0969da)',
    },
    'data-type': 'url',
    className: 'w-rjv-type',
    children: 'url',
  },
  Undefined: {
    style: {
      color: 'var(--w-rjv-type-undefined-color, #586e75)',
    },
    as: 'span',
    'data-type': 'undefined',
    className: 'w-rjv-type',
    children: 'undefined',
  },
  Null: {
    style: {
      color: 'var(--w-rjv-type-null-color, #d33682)',
    },
    as: 'span',
    'data-type': 'null',
    className: 'w-rjv-type',
    children: 'null',
  },
  Map: {
    style: {
      color: 'var(--w-rjv-type-map-color, #268bd2)',
      marginRight: 3,
    },
    as: 'span',
    'data-type': 'map',
    className: 'w-rjv-type',
    children: 'Map',
  },
  Nan: {
    style: {
      color: 'var(--w-rjv-type-nan-color, #859900)',
    },
    as: 'span',
    'data-type': 'nan',
    className: 'w-rjv-type',
    children: 'NaN',
  },
  Bigint: {
    style: {
      color: 'var(--w-rjv-type-bigint-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'bigint',
    className: 'w-rjv-type',
    children: 'bigint',
  },
  Int: {
    style: {
      color: 'var(--w-rjv-type-int-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'int',
    className: 'w-rjv-type',
    children: 'int',
  },
  Set: {
    style: {
      color: 'var(--w-rjv-type-set-color, #268bd2)',
      marginRight: 3,
    },
    as: 'span',
    'data-type': 'set',
    className: 'w-rjv-type',
    children: 'Set',
  },
  Float: {
    style: {
      color: 'var(--w-rjv-type-float-color, #859900)',
    },
    as: 'span',
    'data-type': 'float',
    className: 'w-rjv-type',
    children: 'float',
  },
  True: {
    style: {
      color: 'var(--w-rjv-type-boolean-color, #2aa198)',
    },
    as: 'span',
    'data-type': 'bool',
    className: 'w-rjv-type',
    children: 'bool',
  },
  False: {
    style: {
      color: 'var(--w-rjv-type-boolean-color, #2aa198)',
    },
    as: 'span',
    'data-type': 'bool',
    className: 'w-rjv-type',
    children: 'bool',
  },
  Date: {
    style: {
      color: 'var(--w-rjv-type-date-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'date',
    className: 'w-rjv-type',
    children: 'date',
  },
};

const Context = createContext<InitialTypesState<TagType>>(initialState);

const reducer = <T extends TagType>(state: InitialTypesState<T>, action: InitialTypesState<T>) => ({
  ...state,
  ...action,
});

export const useTypesStore = () => {
  return useContext(Context);
};

const DispatchTypes = createContext<Dispatch<TagType>>(() => {});
DispatchTypes.displayName = 'JVR.DispatchTypes';

export function useTypes() {
  return useReducer(reducer, initialState);
}

export function useTypesDispatch() {
  return useContext(DispatchTypes);
}

interface TypesProps<T extends TagType> {
  initial: InitialTypesState<T>;
  dispatch: Dispatch<TagType>;
}

export function Types<T extends TagType>({ initial, dispatch, children }: PropsWithChildren<TypesProps<T>>) {
  return (
    <Context.Provider value={initial as unknown as InitialTypesState<TagType>}>
      <DispatchTypes.Provider value={dispatch}>{children}</DispatchTypes.Provider>
    </Context.Provider>
  );
}

Types.displayName = 'JVR.Types';
````

## File: core/src/symbol/Arrow.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';

it('renders <JsonView.Arrow /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Arrow>
        <TriangleSolidArrow data-testid="arrow" />
      </JsonView.Arrow>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('arrow') as unknown as SVGSVGElement;
    expect(arrow.tagName).toBe('svg');
  });
});

it('renders <JsonView.Arrow /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Arrow
        render={() => {
          return <span data-testid="arrow">x</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('arrow');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.innerHTML).toBe('x');
  });
});
````

## File: core/src/symbol/Arrow.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const Arrow = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { Arrow: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'Arrow');
  return null;
};

Arrow.displayName = 'JVR.Arrow';
````

## File: core/src/symbol/BraceLeft.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.BraceLeft /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BraceLeft data-testid="brace">x</JsonView.BraceLeft>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.innerHTML).toBe('x');
  });
});

it('renders <JsonView.BraceLeft render /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BraceLeft
        data-testid="brace"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-curlybraces-color, #236a7c)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.className).toBe('w-rjv-curlybraces-start');
    expect(arrow.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/BraceLeft.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const BraceLeft = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { BraceLeft: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'BraceLeft');

  return null;
};

BraceLeft.displayName = 'JVR.BraceLeft';
````

## File: core/src/symbol/BraceRight.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.BraceRight /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BraceRight as="span" data-testid="brace">
        x
      </JsonView.BraceRight>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.innerHTML).toBe('x');
  });
});

it('renders <JsonView.BraceRight render /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BraceRight
        data-testid="brace"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-curlybraces-color, #236a7c)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.className).toBe('w-rjv-curlybraces-end');
    expect(arrow.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/BraceRight.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const BraceRight = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { BraceRight: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'BraceRight');
  return null;
};

BraceRight.displayName = 'JVR.BraceRight';
````

## File: core/src/symbol/BracketsLeft.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.BracketsLeft /> test case', async () => {
  const demo = {
    value: ['123'],
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BracketsLeft data-testid="brace">x</JsonView.BracketsLeft>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.innerHTML).toBe('x');
  });
});

it('renders <JsonView.BracketsLeft render /> test case', async () => {
  const demo = {
    value: ['123'],
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BracketsLeft
        data-testid="brace"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-brackets-color, #236a7c)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.className).toBe('w-rjv-brackets-start');
    expect(arrow.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/BracketsLeft.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const BracketsLeft = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { BracketsLeft: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'BracketsLeft');

  return null;
};

BracketsLeft.displayName = 'JVR.BracketsLeft';
````

## File: core/src/symbol/BracketsRight.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.BracketsRight /> test case', async () => {
  const demo = {
    value: ['123'],
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BracketsRight data-testid="brace">x</JsonView.BracketsRight>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.innerHTML).toBe('x');
  });
});

it('renders <JsonView.BracketsRight render /> test case', async () => {
  const demo = {
    value: ['123'],
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.BracketsRight
        data-testid="brace"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-brackets-color, #236a7c)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const arrow = screen.getByTestId('brace');
    expect(arrow.tagName).toBe('SPAN');
    expect(arrow.className).toBe('w-rjv-brackets-end');
    expect(arrow.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/BracketsRight.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const BracketsRight = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { BracketsRight: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'BracketsRight');

  return null;
};

BracketsRight.displayName = 'JVR.BracketsRight';
````

## File: core/src/symbol/Colon.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.Colon /> test case', async () => {
  const demo = {
    value: 123,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Colon data-testid="brace">x</JsonView.Colon>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getByTestId('brace');
    expect(elm.tagName).toBe('SPAN');
    expect(elm.innerHTML).toBe('x');
  });
});

it('renders <JsonView.Colon render /> test case', async () => {
  const demo = {
    value: 123,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Colon
        data-testid="colon"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-colon-color, var(--w-rjv-color))');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getByTestId('colon');
    expect(elm.tagName).toBe('SPAN');
    expect(elm.className).toBe('w-rjv-colon');
    expect(elm.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/Colon.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const Colon = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { Colon: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'Colon');

  return null;
};

Colon.displayName = 'JVR.Colon';
````

## File: core/src/symbol/index.tsx
````typescript
import { useSymbolsStore, type SymbolsElement, type SymbolsElementResult } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useExpandsStore } from '../store/Expands';

export const Quote = <T extends object>(
  props: { isNumber?: boolean } & React.HTMLAttributes<HTMLElement> & SymbolsElementResult<T>,
) => {
  const { Quote: Comp = {} } = useSymbolsStore();
  const { isNumber, value, parentValue, keyName, keys, ...other } = props;
  if (isNumber) return null;
  const { as, render, ...reset } = Comp;
  const Elm = as || 'span';
  const elmProps = { ...other, ...reset };
  let result = { value, parentValue, keyName, keys: keys || (keyName ? [keyName] : []) };
  const child = render && typeof render === 'function' && render(elmProps, result);
  if (child) return child;
  return <Elm {...elmProps} />;
};

Quote.displayName = 'JVR.Quote';

export const ValueQuote = (props: React.HTMLAttributes<HTMLElement>) => {
  const { ValueQuote: Comp = {} } = useSymbolsStore();
  const { ...other } = props;
  const { as, render, ...reset } = Comp;
  const Elm = as || 'span';
  const elmProps = { ...other, ...reset };
  const child = render && typeof render === 'function' && render(elmProps, {});
  if (child) return child;
  return <Elm {...elmProps} />;
};

ValueQuote.displayName = 'JVR.ValueQuote';

export const Colon = <T extends object>(props: SymbolsElementResult<T>) => {
  const { value, parentValue, keyName, keys } = props;
  const { Colon: Comp = {} } = useSymbolsStore();
  const { as, render, ...reset } = Comp;
  const Elm = as || 'span';
  const child =
    render &&
    typeof render === 'function' &&
    render(reset, {
      value,
      parentValue,
      keyName,
      keys: keys || (keyName ? [keyName] : []),
    });
  if (child) return child;
  return <Elm {...reset} />;
};

Colon.displayName = 'JVR.Colon';

export const Arrow = <T extends TagType, K extends object>(
  props: SymbolsElement<T> & { expandKey: string } & SymbolsElementResult<K>,
) => {
  const { Arrow: Comp = {} } = useSymbolsStore();
  const expands = useExpandsStore();
  const { expandKey, style: resetStyle, value, parentValue, keyName, keys } = props;
  const isExpanded = !!expands[expandKey];
  const { as, style, render, ...reset } = Comp;
  const Elm = as || 'span';
  const isRender = render && typeof render === 'function';
  const elmProps = { ...reset, 'data-expanded': isExpanded, style: { ...style, ...resetStyle } };
  const result = { value, parentValue, keyName, keys: keys || (keyName ? [keyName] : []) };
  const child = isRender && render(elmProps, result);
  if (child) return child;
  return <Elm {...reset} style={{ ...style, ...resetStyle }} />;
};

Arrow.displayName = 'JVR.Arrow';

export const BracketsOpen = <K extends object>(props: { isBrackets?: boolean } & SymbolsElementResult<K>) => {
  const { isBrackets, value, parentValue, keyName, keys } = props;
  const { BracketsLeft = {}, BraceLeft = {} } = useSymbolsStore();
  const result = { value, parentValue, keyName, keys: keys || (keyName ? [keyName] : []) };
  if (isBrackets) {
    const { as, render, ...reset } = BracketsLeft;
    const BracketsLeftComp = as || 'span';
    const child = render && typeof render === 'function' && render(reset, result);
    if (child) return child;
    return <BracketsLeftComp {...reset} />;
  }
  const { as: elm, render, ...resetProps } = BraceLeft;
  const BraceLeftComp = elm || 'span';
  const child = render && typeof render === 'function' && render(resetProps, result);
  if (child) return child;
  return <BraceLeftComp {...resetProps} />;
};

BracketsOpen.displayName = 'JVR.BracketsOpen';

type BracketsCloseProps = {
  isBrackets?: boolean;
  isVisiable?: boolean;
};

export const BracketsClose = <K extends object>(props: BracketsCloseProps & SymbolsElementResult<K>) => {
  const { isBrackets, isVisiable, value, parentValue, keyName, keys } = props;
  const result = { value, parentValue, keyName, keys: keys || (keyName ? [keyName] : []) };
  if (!isVisiable) return null;
  const { BracketsRight = {}, BraceRight = {} } = useSymbolsStore();
  if (isBrackets) {
    const { as, render, ...reset } = BracketsRight;
    const BracketsRightComp = as || 'span';
    const child = render && typeof render === 'function' && render(reset, result);
    if (child) return child;
    return <BracketsRightComp {...reset} />;
  }
  const { as: elm, render, ...reset } = BraceRight;
  const BraceRightComp = elm || 'span';
  const child = render && typeof render === 'function' && render(reset, result);
  if (child) return child;
  return <BraceRightComp {...reset} />;
};

BracketsClose.displayName = 'JVR.BracketsClose';
````

## File: core/src/symbol/Quote.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.Quote /> test case', async () => {
  const demo = {
    value: 123,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Quote data-testid="quote">x</JsonView.Quote>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getAllByTestId('quote')[0];
    expect(elm.tagName).toBe('SPAN');
    expect(elm.innerHTML).toBe('x');
  });
});

it('renders <JsonView.Quote render /> test case', async () => {
  const demo = {
    value: 123,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Quote
        data-testid="quote"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-quotes-color, #236a7c)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getAllByTestId('quote')[0];
    expect(elm.tagName).toBe('SPAN');
    expect(elm.className).toBe('w-rjv-quotes');
    expect(elm.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/Quote.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const Quote = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { Quote: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'Quote');

  return null;
};

Quote.displayName = 'JVR.Quote';
````

## File: core/src/symbol/ValueQuote.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.ValueQuote /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.ValueQuote data-testid="quote">|</JsonView.ValueQuote>
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getAllByTestId('quote')[1];
    expect(elm.tagName).toBe('SPAN');
    expect(elm.innerHTML).toBe('|');
  });
});

it('renders <JsonView.ValueQuote render /> test case', async () => {
  const demo = {
    value: '123',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.ValueQuote
        data-testid="quote"
        render={(props) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-quotes-string-color, #cb4b16)');
          return <span {...props}>.......</span>;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const elm = screen.getAllByTestId('quote')[0];
    expect(elm.tagName).toBe('SPAN');
    expect(elm.className).toBe('w-rjv-quotes');
    expect(elm.innerHTML).toBe('.......');
  });
});
````

## File: core/src/symbol/ValueQuote.tsx
````typescript
import { useSymbolsStore, type SymbolsElement } from '../store/Symbols';
import { type TagType } from '../store/Types';
import { useSymbolsRender } from '../utils/useRender';

export const ValueQuote = <K extends TagType = 'span'>(props: SymbolsElement<K>) => {
  const { ValueQuote: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'ValueQuote');

  return null;
};

ValueQuote.displayName = 'JVR.ValueQuote';
````

## File: core/src/theme/basic.test.ts
````typescript
import { basicTheme } from './basic';

it('basicTheme test case', () => {
  expect(basicTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(basicTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-number',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-ellipsis-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/basic.tsx
````typescript
export const basicTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#b5bd68',
  '--w-rjv-key-number': '#002b36',
  '--w-rjv-key-string': '#b5bd68',
  '--w-rjv-background-color': '#2E3235',
  '--w-rjv-line-color': '#292d30',
  '--w-rjv-arrow-color': 'var(--w-rjv-color)',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#d8d8d84d',
  '--w-rjv-update-color': '#b5bd68',
  '--w-rjv-copied-color': '#b5bd68',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#cc99cc',
  '--w-rjv-colon-color': '#bababa',
  '--w-rjv-brackets-color': '#808080',
  '--w-rjv-ellipsis-color': '#cb4b16',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#b5bd68',
  '--w-rjv-type-int-color': '#fda331',
  '--w-rjv-type-float-color': '#fda331',
  '--w-rjv-type-bigint-color': '#fda331',
  '--w-rjv-type-boolean-color': '#fda331',
  '--w-rjv-type-date-color': '#8abeb7',
  '--w-rjv-type-url-color': '#5a89c0',
  '--w-rjv-type-null-color': '#8abeb7',
  '--w-rjv-type-nan-color': '#8abeb7',
  '--w-rjv-type-undefined-color': '#8abeb7',
} as React.CSSProperties;
````

## File: core/src/theme/dark.test.ts
````typescript
import { darkTheme } from './dark';

it('darkTheme test case', () => {
  expect(darkTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(darkTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/dark.ts
````typescript
export const darkTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#0184a6',
  '--w-rjv-key-string': '#0184a6',
  '--w-rjv-background-color': '#202020',
  '--w-rjv-line-color': '#323232',
  '--w-rjv-arrow-color': 'var(--w-rjv-color)',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#656565',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#0184a6',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#1896b6',
  '--w-rjv-brackets-color': '#1896b6',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#cb4b16',
  '--w-rjv-type-int-color': '#268bd2',
  '--w-rjv-type-float-color': '#859900',
  '--w-rjv-type-bigint-color': '#268bd2',
  '--w-rjv-type-boolean-color': '#2aa198',
  '--w-rjv-type-date-color': '#586e75',
  '--w-rjv-type-url-color': '#649bd8',
  '--w-rjv-type-null-color': '#d33682',
  '--w-rjv-type-nan-color': '#076678',
  '--w-rjv-type-undefined-color': '#586e75',
} as React.CSSProperties;
````

## File: core/src/theme/github.dark.test.ts
````typescript
import { githubDarkTheme } from './github.dark';

it('githubDarkTheme test case', () => {
  expect(githubDarkTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(githubDarkTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/github.dark.tsx
````typescript
export const githubDarkTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#79c0ff',
  '--w-rjv-key-string': '#79c0ff',
  '--w-rjv-background-color': '#0d1117',
  '--w-rjv-line-color': '#94949480',
  '--w-rjv-arrow-color': '#ccc',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#7b7b7b',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#79c0ff',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#8b949e',
  '--w-rjv-colon-color': '#c9d1d9',
  '--w-rjv-brackets-color': '#8b949e',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#a5d6ff',
  '--w-rjv-type-int-color': '#79c0ff',
  '--w-rjv-type-float-color': '#79c0ff',
  '--w-rjv-type-bigint-color': '#79c0ff',
  '--w-rjv-type-boolean-color': '#ffab70',
  '--w-rjv-type-date-color': '#79c0ff',
  '--w-rjv-type-url-color': '#4facff',
  '--w-rjv-type-null-color': '#ff7b72',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#79c0ff',
} as React.CSSProperties;
````

## File: core/src/theme/github.light.test.ts
````typescript
import { githubLightTheme } from './github.light';

it('githubLightTheme test case', () => {
  expect(githubLightTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(githubLightTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/github.light.tsx
````typescript
export const githubLightTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#6f42c1',
  '--w-rjv-key-string': '#6f42c1',
  '--w-rjv-background-color': '#ffffff',
  '--w-rjv-line-color': '#ddd',
  '--w-rjv-arrow-color': '#6e7781',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#0000004d',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#002b36',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#6a737d',
  '--w-rjv-colon-color': '#24292e',
  '--w-rjv-brackets-color': '#6a737d',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#032f62',
  '--w-rjv-type-int-color': '#005cc5',
  '--w-rjv-type-float-color': '#005cc5',
  '--w-rjv-type-bigint-color': '#005cc5',
  '--w-rjv-type-boolean-color': '#d73a49',
  '--w-rjv-type-date-color': '#005cc5',
  '--w-rjv-type-url-color': '#0969da',
  '--w-rjv-type-null-color': '#d73a49',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#005cc5',
} as React.CSSProperties;
````

## File: core/src/theme/gruvbox.test.ts
````typescript
import { gruvboxTheme } from './gruvbox';

it('gruvboxTheme test case', () => {
  expect(gruvboxTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(gruvboxTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/gruvbox.tsx
````typescript
export const gruvboxTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#3c3836',
  '--w-rjv-key-string': '#3c3836',
  '--w-rjv-background-color': '#fbf1c7',
  '--w-rjv-line-color': '#ebdbb2',
  '--w-rjv-arrow-color': 'var(--w-rjv-color)',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#0000004d',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#002b36',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#236a7c',
  '--w-rjv-colon-color': '#002b36',
  '--w-rjv-brackets-color': '#236a7c',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#3c3836',
  '--w-rjv-type-int-color': '#8f3f71',
  '--w-rjv-type-float-color': '#8f3f71',
  '--w-rjv-type-bigint-color': '#8f3f71',
  '--w-rjv-type-boolean-color': '#8f3f71',
  '--w-rjv-type-date-color': '#076678',
  '--w-rjv-type-url-color': '#0969da',
  '--w-rjv-type-null-color': '#076678',
  '--w-rjv-type-nan-color': '#076678',
  '--w-rjv-type-undefined-color': '#076678',
} as React.CSSProperties;
````

## File: core/src/theme/light.test.ts
````typescript
import { lightTheme } from './light';

it('lightTheme test case', () => {
  expect(lightTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(lightTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/light.ts
````typescript
export const lightTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#002b36',
  '--w-rjv-key-string': '#002b36',
  '--w-rjv-background-color': '#ffffff',
  '--w-rjv-line-color': '#ebebeb',
  '--w-rjv-arrow-color': 'var(--w-rjv-color)',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#0000004d',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#002b36',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#236a7c',
  '--w-rjv-colon-color': '#002b36',
  '--w-rjv-brackets-color': '#236a7c',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#cb4b16',
  '--w-rjv-type-int-color': '#268bd2',
  '--w-rjv-type-float-color': '#859900',
  '--w-rjv-type-bigint-color': '#268bd2',
  '--w-rjv-type-boolean-color': '#2aa198',
  '--w-rjv-type-date-color': '#586e75',
  '--w-rjv-type-url-color': '#0969da',
  '--w-rjv-type-null-color': '#d33682',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#586e75',
} as React.CSSProperties;
````

## File: core/src/theme/monokai.test.ts
````typescript
import { monokaiTheme } from './monokai';

it('monokaiTheme test case', () => {
  expect(monokaiTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(monokaiTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/monokai.tsx
````typescript
export const monokaiTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#E6DB74',
  '--w-rjv-key-string': '#E6DB74',
  '--w-rjv-background-color': '#272822',
  '--w-rjv-line-color': '#3e3d32',
  '--w-rjv-arrow-color': '#f8f8f2',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#cecece4d',
  '--w-rjv-update-color': '#5f5600',
  '--w-rjv-copied-color': '#E6DB74',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#f8f8f2',
  '--w-rjv-colon-color': '#f8f8f2',
  '--w-rjv-brackets-color': '#f8f8f2',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#E6DB74',
  '--w-rjv-type-int-color': '#AE81FF',
  '--w-rjv-type-float-color': '#AE81FF',
  '--w-rjv-type-bigint-color': '#AE81FF',
  '--w-rjv-type-boolean-color': '#AE81FF',
  '--w-rjv-type-date-color': '#fd9720c7',
  '--w-rjv-type-url-color': '#55a3ff',
  '--w-rjv-type-null-color': '#FA2672',
  '--w-rjv-type-nan-color': '#FD971F',
  '--w-rjv-type-undefined-color': '#FD971F',
} as React.CSSProperties;
````

## File: core/src/theme/nord.test.ts
````typescript
import { nordTheme } from './nord';

it('nordTheme test case', () => {
  expect(nordTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(nordTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/nord.tsx
````typescript
export const nordTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#88c0d0',
  '--w-rjv-key-string': '#88c0d0',
  '--w-rjv-background-color': '#2e3440',
  '--w-rjv-line-color': '#4c566a',
  '--w-rjv-arrow-color': 'var(--w-rjv-color)',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#c7c7c74d',
  '--w-rjv-update-color': '#88c0cf75',
  '--w-rjv-copied-color': '#119cc0',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#8fbcbb',
  '--w-rjv-colon-color': '#6d9fac',
  '--w-rjv-brackets-color': '#8fbcbb',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#a3be8c',
  '--w-rjv-type-int-color': '#b48ead',
  '--w-rjv-type-float-color': '#859900',
  '--w-rjv-type-bigint-color': '#b48ead',
  '--w-rjv-type-boolean-color': '#d08770',
  '--w-rjv-type-date-color': '#41a2c2',
  '--w-rjv-type-url-color': '#5e81ac',
  '--w-rjv-type-null-color': '#5e81ac',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#586e75',
} as React.CSSProperties;
````

## File: core/src/theme/vscode.test.ts
````typescript
import { vscodeTheme } from './vscode';

it('vscodeTheme test case', () => {
  expect(vscodeTheme).toHaveProperty('--w-rjv-font-family', 'monospace');
  expect(Object.keys(vscodeTheme)).toMatchObject([
    '--w-rjv-font-family',
    '--w-rjv-color',
    '--w-rjv-key-string',
    '--w-rjv-background-color',
    '--w-rjv-line-color',
    '--w-rjv-arrow-color',
    '--w-rjv-edit-color',
    '--w-rjv-info-color',
    '--w-rjv-update-color',
    '--w-rjv-copied-color',
    '--w-rjv-copied-success-color',
    '--w-rjv-curlybraces-color',
    '--w-rjv-colon-color',
    '--w-rjv-brackets-color',
    '--w-rjv-quotes-color',
    '--w-rjv-quotes-string-color',
    '--w-rjv-type-string-color',
    '--w-rjv-type-int-color',
    '--w-rjv-type-float-color',
    '--w-rjv-type-bigint-color',
    '--w-rjv-type-boolean-color',
    '--w-rjv-type-date-color',
    '--w-rjv-type-url-color',
    '--w-rjv-type-null-color',
    '--w-rjv-type-nan-color',
    '--w-rjv-type-undefined-color',
  ]);
});
````

## File: core/src/theme/vscode.ts
````typescript
export const vscodeTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#9cdcfe',
  '--w-rjv-key-string': '#9cdcfe',
  '--w-rjv-background-color': '#1e1e1e',
  '--w-rjv-line-color': '#36334280',
  '--w-rjv-arrow-color': '#838383',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#9c9c9c7a',
  '--w-rjv-update-color': '#9cdcfe',
  '--w-rjv-copied-color': '#9cdcfe',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#d4d4d4',
  '--w-rjv-colon-color': '#d4d4d4',
  '--w-rjv-brackets-color': '#d4d4d4',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#ce9178',
  '--w-rjv-type-int-color': '#b5cea8',
  '--w-rjv-type-float-color': '#b5cea8',
  '--w-rjv-type-bigint-color': '#b5cea8',
  '--w-rjv-type-boolean-color': '#569cd6',
  '--w-rjv-type-date-color': '#b5cea8',
  '--w-rjv-type-url-color': '#3b89cf',
  '--w-rjv-type-null-color': '#569cd6',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#569cd6',
} as React.CSSProperties;
````

## File: core/src/types/Bigint.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Bigint = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Bigint: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Bigint');

  return null;
};

Bigint.displayName = 'JVR.Bigint';
````

## File: core/src/types/Date.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '../';

it('renders <JsonView.Date /> test case', async () => {
  const demo = {
    date: new Date('2023/02/12'),
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Date
        as="span"
        render={(props, { type, value }) => {
          expect((value as Date).getDate()).toBe(demo.date.getDate());
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-date-color, #268bd2)');

          if (type === 'type') {
            return <span {...props} data-testid="date-type" />;
          }
          props.children = (value as Date).toLocaleString();
          return <span {...props} data-testid="date-value" />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('date-type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('date');
    const value = screen.getByTestId('date-value');
    expect(value.className).toBe('w-rjv-value');
    expect(value.tagName).toBe('SPAN');
    expect(value.innerHTML).toBe(demo.date.toLocaleString());
  });
});
````

## File: core/src/types/Date.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Date = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Date: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Date');

  return null;
};

Date.displayName = 'JVR.Date';
````

## File: core/src/types/False.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const False = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { False: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'False');

  return null;
};

False.displayName = 'JVR.False';
````

## File: core/src/types/Float.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Float = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Float: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Float');

  return null;
};

Float.displayName = 'JVR.Float';
````

## File: core/src/types/index.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

it('renders <JsonView.String /> test case', async () => {
  const demo = {
    string: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.String
        render={(props, { type }) => {
          if (type === 'type') {
            expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-string-color, #cb4b16)');
            return <em {...props} data-testid="str-type" />;
          }
          return <span {...props} data-testid="str-value" />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('str-type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('EM');
    expect(type.innerHTML).toBe('string');
    const value = screen.getByTestId('str-value');
    expect(value.className).toBe('w-rjv-value w-rjv-value-short');
    expect(value.tagName).toBe('SPAN');
    expect(value).toHaveProperty('style.cursor', 'pointer');
  });
});

[
  {
    name: 'Bigint',
    Comp: JsonView.Bigint,
    value: BigInt(10086),
    field: 'bigint',
    color: 'var(--w-rjv-type-bigint-color, #268bd2)',
  },
  {
    name: 'False',
    Comp: JsonView.False,
    value: false,
    field: 'bool',
    color: 'var(--w-rjv-type-boolean-color, #2aa198)',
  },
  {
    name: 'Float',
    Comp: JsonView.Float,
    value: 0.3,
    field: 'float',
    color: 'var(--w-rjv-type-float-color, #859900)',
  },
  {
    name: 'Int',
    Comp: JsonView.Int,
    value: 123,
    field: 'int',
    color: 'var(--w-rjv-type-int-color, #268bd2)',
  },
  {
    name: 'True',
    Comp: JsonView.True,
    value: true,
    field: 'bool',
    color: 'var(--w-rjv-type-boolean-color, #2aa198)',
  },
  {
    name: 'Null',
    Comp: JsonView.Null,
    value: null,
    field: 'null',
    color: 'var(--w-rjv-type-null-color, #d33682)',
  },
  {
    name: 'Undefined',
    Comp: JsonView.Undefined,
    value: undefined,
    field: 'undefined',
    color: 'var(--w-rjv-type-undefined-color, #586e75)',
  },
  // {
  //   name: 'Nan',
  //   Comp: JsonView.Nan,
  //   value: NaN,
  //   field: 'NaN',
  //   color: 'var(--w-rjv-type-nan-color, #859900)',
  // },
  // {
  //   name: 'Date',
  //   Comp: JsonView.Date,
  //   value: new Date('2023/02/12'),
  //   field: 'date',
  //   color: 'var(--w-rjv-type-date-color, #268bd2)',
  // },
  // {
  //   name: 'Url',
  //   Comp: JsonView.Url,
  //   value: new URL('https://www.google.com'),
  //   field: 'url',
  //   color: 'var(--w-rjv-type-url-color, #0969da)',
  // },
  // {
  //   name: 'Map',
  //   Comp: JsonView.Map,
  //   value: myMap,
  //   field: 'map',
  //   color: 'var(--w-rjv-type-map-color, #268bd2)',
  // },
].forEach(({ name, value: val, field, color, Comp }) => {
  it(`renders <JsonView.${name} /> test case`, async () => {
    const demo = {
      value: val,
    };
    const { container } = render(
      <JsonView value={demo}>
        <Comp
          render={(props, { type, value }) => {
            expect(value).toBe(val);
            expect(props.style).toHaveProperty('color', color);
            return <span {...props} data-testid={`${name}-${type}`} />;
          }}
        />
      </JsonView>,
    );
    expect(container.firstElementChild).toBeInstanceOf(Element);
    await waitFor(() => {
      const type = screen.getByTestId(`${name}-type`);
      expect(type.className).toBe('w-rjv-type');
      expect(type.tagName).toBe('SPAN');
      expect(type.innerHTML).toBe(field);
      const value = screen.getByTestId(`${name}-value`);
      expect(value.className).toBe('w-rjv-value');
      expect(value.tagName).toBe('SPAN');
    });
  });
});
````

## File: core/src/types/index.tsx
````typescript
import { FC, Fragment, PropsWithChildren, useEffect, useState } from 'react';
import { useStore } from '../store';
import { useTypesStore } from '../store/Types';
import { ValueQuote } from '../symbol/';

export const bigIntToString = (bi?: BigInt | string) => {
  if (bi === undefined) {
    return '0n';
  } else if (typeof bi === 'string') {
    try {
      bi = BigInt(bi);
    } catch (e) {
      return '0n';
    }
  }
  return bi ? bi.toString() + 'n' : '0n';
};

export const SetComp: FC<PropsWithChildren<{ value: unknown; keyName: string | number }>> = ({ value, keyName }) => {
  const { Set: Comp = {}, displayDataTypes } = useTypesStore();
  const isSet = value instanceof Set;
  if (!isSet || !displayDataTypes) return null;
  const { as, render, ...reset } = Comp;
  const isRender = render && typeof render === 'function';
  const type = isRender && render(reset, { type: 'type', value, keyName });
  if (type) return type;

  const Elm = as || 'span';
  return <Elm {...reset} />;
};

SetComp.displayName = 'JVR.SetComp';

export const MapComp: FC<PropsWithChildren<{ value: unknown; keyName: string | number }>> = ({ value, keyName }) => {
  const { Map: Comp = {}, displayDataTypes } = useTypesStore();
  const isMap = value instanceof Map;
  if (!isMap || !displayDataTypes) return null;
  const { as, render, ...reset } = Comp;
  const isRender = render && typeof render === 'function';
  const type = isRender && render(reset, { type: 'type', value, keyName });
  if (type) return type;

  const Elm = as || 'span';
  return <Elm {...reset} />;
};

MapComp.displayName = 'JVR.MapComp';

const defalutStyle: React.CSSProperties = {
  opacity: 0.75,
  paddingRight: 4,
};

type TypeProps = PropsWithChildren<{
  keyName: string | number;
}>;

export const TypeString: FC<TypeProps> = ({ children = '', keyName }) => {
  const { Str = {}, displayDataTypes } = useTypesStore();
  const { shortenTextAfterLength: length = 30, stringEllipsis = '...' } = useStore();
  const { as, render, ...reset } = Str;
  const childrenStr = children as string;
  const [shorten, setShorten] = useState(length && childrenStr.length > length);
  useEffect(() => setShorten(length && childrenStr.length > length), [length]);
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Str.style || {}),
  };

  if (length > 0) {
    reset.style = {
      ...reset.style,
      cursor: childrenStr.length <= length ? 'initial' : 'pointer',
    };
    if (childrenStr.length > length) {
      reset.onClick = () => {
        setShorten(!shorten);
      };
    }
  }
  const text = shorten ? `${childrenStr.slice(0, length)}${stringEllipsis}` : childrenStr;

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const cls = shorten ? 'w-rjv-value w-rjv-value-short' : 'w-rjv-value';
  const child =
    isRender && render({ ...reset, children: text, className: cls }, { type: 'value', value: children, keyName });
  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Fragment>
          <ValueQuote />
          <Comp {...reset} className={cls}>
            {text}
          </Comp>
          <ValueQuote />
        </Fragment>
      )}
    </Fragment>
  );
};

TypeString.displayName = 'JVR.TypeString';

export const TypeTrue: FC<TypeProps> = ({ children, keyName }) => {
  const { True = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = True;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(True.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });
  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
    </Fragment>
  );
};

TypeTrue.displayName = 'JVR.TypeTrue';

export const TypeFalse: FC<TypeProps> = ({ children, keyName }) => {
  const { False = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = False;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(False.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
    </Fragment>
  );
};

TypeFalse.displayName = 'JVR.TypeFalse';

export const TypeFloat: FC<TypeProps> = ({ children, keyName }) => {
  const { Float = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Float;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Float.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
    </Fragment>
  );
};

TypeFloat.displayName = 'JVR.TypeFloat';

export const TypeInt: FC<TypeProps> = ({ children, keyName }) => {
  const { Int = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Int;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Int.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
    </Fragment>
  );
};

TypeInt.displayName = 'JVR.TypeInt';

export const TypeBigint: FC<{ children?: BigInt } & Omit<TypeProps, 'children'>> = ({ children, keyName }) => {
  const { Bigint: CompBigint = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = CompBigint;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(CompBigint.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {bigIntToString(children?.toString())}
        </Comp>
      )}
    </Fragment>
  );
};

TypeBigint.displayName = 'JVR.TypeFloat';

export const TypeUrl: FC<{ children?: URL } & Omit<TypeProps, 'children'>> = ({ children, keyName }) => {
  const { Url = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Url;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...Url.style,
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender &&
    render(
      { ...reset, children: children?.href, className: 'w-rjv-value' },
      { type: 'value', value: children, keyName },
    );

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <a href={children?.href} target="_blank" {...reset} className="w-rjv-value">
          <ValueQuote />
          {children?.href}
          <ValueQuote />
        </a>
      )}
    </Fragment>
  );
};

TypeUrl.displayName = 'JVR.TypeUrl';

export const TypeDate: FC<{ children?: Date } & Omit<TypeProps, 'children'>> = ({ children, keyName }) => {
  const { Date: CompData = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = CompData;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(CompData.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const childStr = children instanceof Date ? children.toLocaleString() : children;
  const child =
    isRender &&
    render({ ...reset, children: childStr, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {childStr}
        </Comp>
      )}
    </Fragment>
  );
};

TypeDate.displayName = 'JVR.TypeDate';

export const TypeUndefined: FC<TypeProps> = ({ children, keyName }) => {
  const { Undefined = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Undefined;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Undefined.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
    </Fragment>
  );
};

TypeUndefined.displayName = 'JVR.TypeUndefined';

export const TypeNull: FC<TypeProps> = ({ children, keyName }) => {
  const { Null = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Null;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Null.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender && render({ ...reset, children, className: 'w-rjv-value' }, { type: 'value', value: children, keyName });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
    </Fragment>
  );
};

TypeNull.displayName = 'JVR.TypeNull';

export const TypeNan: FC<TypeProps> = ({ children, keyName }) => {
  const { Nan = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Nan;
  const Comp = as || 'span';
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Nan.style || {}),
  };

  const isRender = render && typeof render === 'function';
  const type = isRender && render({ ...reset, style }, { type: 'type', value: children, keyName });
  const child =
    isRender &&
    render(
      { ...reset, children: children?.toString(), className: 'w-rjv-value' },
      { type: 'value', value: children, keyName },
    );

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
    </Fragment>
  );
};

TypeNan.displayName = 'JVR.TypeNan';
````

## File: core/src/types/Int.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Int = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Int: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Int');

  return null;
};

Int.displayName = 'JVR.Int';
````

## File: core/src/types/Map.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

const myMap = new Map();
myMap.set('www', 'foo');
myMap.set(1, 'bar');

it('renders <JsonView.Map /> test case', async () => {
  const demo = {
    value: myMap,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Map
        as="span"
        render={(props, { type, value }) => {
          expect(type).toEqual('type');
          expect(value).toEqual(myMap);
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-map-color, #268bd2)');
          if (type === 'type') {
            return <span {...props} data-testid="type" />;
          }
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('Map');
  });
});
````

## File: core/src/types/Map.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Map = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Map: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Map');

  return null;
};

Map.displayName = 'JVR.Map';
````

## File: core/src/types/Nan.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '../';
import { Nan } from './Nan';

it('renders <JsonView.Nan /> test case', async () => {
  const demo = {
    value: NaN,
  };
  const { container } = render(
    <JsonView value={demo}>
      <Nan
        as="span"
        render={(props, { type, value }) => {
          expect(value).toBeNaN();
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-nan-color, #859900)');
          if (type === 'type') {
            return <span {...props} data-testid="type" />;
          }
          return <span {...props} data-testid="value" />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('NaN');
    const value = screen.getByTestId('value');
    expect(value.className).toBe('w-rjv-value');
    expect(value.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('NaN');
  });
});
````

## File: core/src/types/Nan.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Nan = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Nan: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Nan');

  return null;
};

Nan.displayName = 'JVR.Nan';
````

## File: core/src/types/Null.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Null = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Null: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Null');

  return null;
};

Null.displayName = 'JVR.Null';
````

## File: core/src/types/Set.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';

const mySet = new Set();
mySet.add(1); // Set(1) { 1 }
mySet.add(5); // Set(2) { 1, 5 }
mySet.add(5); // Set(2) { 1, 5 }
mySet.add('some text'); // Set(3) { 1, 5, 'some text' }

it('renders <JsonView.Set /> test case', async () => {
  const demo = {
    value: mySet,
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.Set
        as="span"
        render={(props, { type, value }) => {
          expect(type).toEqual('type');
          expect(value).toEqual(mySet);
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-set-color, #268bd2)');
          if (type === 'type') {
            return <span {...props} data-testid="type" />;
          }
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('Set');
  });
});
````

## File: core/src/types/Set.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Set = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Set: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Set');

  return null;
};

Set.displayName = 'JVR.Set';
````

## File: core/src/types/String.test.tsx
````typescript
import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { act } from 'react';
import JsonView from '..';

it('renders <JsonView.String /> test case', async () => {
  const user = userEvent.setup();
  const demo = {
    string: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
  };
  const { container } = render(
    <JsonView value={demo}>
      <JsonView.String
        as="span"
        render={(props, { type, value }) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-string-color, #cb4b16)');
          if (type === 'type') {
            return <span {...props} data-testid="type" />;
          }
          return <span {...props} data-testid="value" />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  const type = screen.getByTestId('type');
  expect(type.className).toBe('w-rjv-type');
  expect(type.tagName).toBe('SPAN');
  expect(type.innerHTML).toBe('string');
  const value = screen.getByTestId('value');
  expect(value.className).toBe('w-rjv-value w-rjv-value-short');
  expect(value.tagName).toBe('SPAN');
  expect(value.innerHTML).toBe('Lorem ipsum dolor sit amet. Lo...');
  await act(async () => {
    await user.click(value);
  });
  expect(value.innerHTML).toBe(demo.string);
  await act(async () => {
    await user.click(value);
  });
  expect(value.innerHTML).toBe('Lorem ipsum dolor sit amet. Lo...');
});
````

## File: core/src/types/String.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const StringText = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Str: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Str');

  return null;
};

StringText.displayName = 'JVR.StringText';
````

## File: core/src/types/True.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const True = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { True: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'True');

  return null;
};

True.displayName = 'JVR.True';
````

## File: core/src/types/Undefined.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Undefined = <K extends TagType = 'span'>(props: TypesElement<K>) => {
  const { Undefined: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Undefined');

  return null;
};

Undefined.displayName = 'JVR.Undefined';
````

## File: core/src/types/Url.test.tsx
````typescript
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from '..';
import { Url } from './Url';

it('renders <JsonView.Url /> test case', async () => {
  const demo = {
    value: new URL('https://wangchujiang.com/'),
  };
  const { container } = render(
    <JsonView value={demo}>
      <Url
        as="span"
        render={(props, { type, value }) => {
          expect(props.style).toHaveProperty('color', 'var(--w-rjv-type-url-color, #0969da)');
          if (type === 'type') {
            return <span {...props} data-testid="type" />;
          }
          return <span {...props} data-testid="value" />;
        }}
      />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  await waitFor(() => {
    const type = screen.getByTestId('type');
    expect(type.className).toBe('w-rjv-type');
    expect(type.tagName).toBe('SPAN');
    expect(type.innerHTML).toBe('url');
    const value = screen.getByTestId('value');
    expect(value.className).toBe('w-rjv-value');
    expect(value.tagName).toBe('SPAN');
    expect(value.innerHTML).toBe(demo.value.href);
  });
});
````

## File: core/src/types/Url.tsx
````typescript
import { useTypesStore, type TagType, type TypesElement } from '../store/Types';
import { useTypesRender } from '../utils/useRender';

export const Url = <K extends TagType = 'a'>(props: TypesElement<K>) => {
  const { Url: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Url');

  return null;
};

Url.displayName = 'JVR.Url';
````

## File: core/src/utils/useHighlight.test.tsx
````typescript
import { renderHook, act } from '@testing-library/react';
import { useHighlight } from './useHighlight';

it('renders <JsonView /> useHighlight test case', async () => {
  const highlightContainerRef = { current: { animate: jest.fn() } } as any;
  const { result, rerender } = renderHook(
    ({ value }) => useHighlight({ value, highlightUpdates: true, highlightContainer: highlightContainerRef }),
    {
      initialProps: { value: 'initial value' },
    },
  );

  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
  // Update value and trigger re-render
  act(() => {
    rerender({ value: 'new value' });
  });
  // Animation should be triggered
  expect(highlightContainerRef.current.animate).toHaveBeenCalledWith(
    [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
    expect.objectContaining({ duration: 1000, easing: 'ease-in' }),
  );
  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: [] });
  });
  // Animation should be triggered
  expect(highlightContainerRef.current.animate).toHaveBeenCalledWith(
    [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
    expect.objectContaining({ duration: 1000, easing: 'ease-in' }),
  );

  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: 23 });
  });
  // Animation should be triggered
  expect(highlightContainerRef.current.animate).toHaveBeenCalledWith(
    [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
    expect.objectContaining({ duration: 1000, easing: 'ease-in' }),
  );
  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: NaN });
  });
  // Animation should be triggered
  expect(highlightContainerRef.current.animate).toHaveBeenCalledWith(
    [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
    expect.objectContaining({ duration: 1000, easing: 'ease-in' }),
  );
});

it('renders <JsonView /> useHighlight Object test case', async () => {
  const highlightContainerRef = { current: { animate: jest.fn() } } as any;
  const { result, rerender } = renderHook(
    ({ value }) => useHighlight({ value, highlightUpdates: true, highlightContainer: highlightContainerRef }),
    {
      initialProps: { value: {} },
    },
  );

  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: {} });
  });
  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
});

it('renders <JsonView /> useHighlight Object test case', async () => {
  const highlightContainerRef = { current: { animate: jest.fn() } } as any;
  const { result, rerender } = renderHook(
    ({ value }) => useHighlight({ value, highlightUpdates: true, highlightContainer: highlightContainerRef }),
    {
      initialProps: { value: {} },
    },
  );

  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: [23] });
  });
  // Animation should be triggered
  expect(highlightContainerRef.current.animate).toHaveBeenCalledWith(
    [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
    expect.objectContaining({ duration: 1000, easing: 'ease-in' }),
  );
});

it('renders <JsonView /> useHighlight Object test case', async () => {
  const highlightContainerRef = { current: { animate: jest.fn() } } as any;
  const { result, rerender } = renderHook(
    ({ value }) => useHighlight({ value, highlightUpdates: true, highlightContainer: highlightContainerRef }),
    {
      initialProps: { value: NaN },
    },
  );

  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
  // Update value and trigger re-render
  act(() => {
    // @ts-ignore
    rerender({ value: NaN });
  });
  // Initial render should not trigger animation
  expect(highlightContainerRef.current.animate).not.toHaveBeenCalled();
});
````

## File: core/src/utils/useHighlight.tsx
````typescript
import { useMemo, useRef, useEffect } from 'react';

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface UseHighlight {
  value: any;
  highlightUpdates?: boolean;
  highlightContainer: React.MutableRefObject<HTMLSpanElement | null>;
}

export function useHighlight({ value, highlightUpdates, highlightContainer }: UseHighlight) {
  const prevValue = usePrevious(value);
  const isHighlight = useMemo(() => {
    if (!highlightUpdates || prevValue === undefined) return false;
    // highlight if value type changed
    if (typeof value !== typeof prevValue) {
      return true;
    }
    if (typeof value === 'number') {
      // notice: NaN !== NaN
      if (isNaN(value) && isNaN(prevValue as unknown as number)) return false;
      return value !== prevValue;
    }
    // highlight if isArray changed
    if (Array.isArray(value) !== Array.isArray(prevValue)) {
      return true;
    }
    // not highlight object/function
    // deep compare they will be slow
    if (typeof value === 'object' || typeof value === 'function') {
      return false;
    }

    // highlight if not equal
    if (value !== prevValue) {
      return true;
    }
  }, [highlightUpdates, value]);

  useEffect(() => {
    if (highlightContainer && highlightContainer.current && isHighlight && 'animate' in highlightContainer.current) {
      highlightContainer.current.animate(
        [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
        {
          duration: 1000,
          easing: 'ease-in',
        },
      );
    }
  }, [isHighlight, value, highlightContainer]);
}
````

## File: core/src/utils/useRender.tsx
````typescript
import { useEffect } from 'react';
import { useSymbolsDispatch, type SymbolsElement } from '../store/Symbols';
import { useTypesDispatch, type TagType, type TypesElement } from '../store/Types';
import { useSectionDispatch, type SectionElement } from '../store/Section';

export function useSymbolsRender<K extends TagType>(
  currentProps: SymbolsElement<TagType>,
  props: SymbolsElement<K>,
  key: string,
) {
  const dispatch = useSymbolsDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}

export function useTypesRender<K extends TagType>(
  currentProps: TypesElement<TagType>,
  props: TypesElement<K>,
  key: string,
) {
  const dispatch = useTypesDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}

export function useSectionRender<K extends TagType>(
  currentProps: SectionElement<TagType>,
  props: SectionElement<K>,
  key: string,
) {
  const dispatch = useSectionDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}
````

## File: core/src/Container.test.tsx
````typescript
import React, { act } from 'react';
import userEvent from '@testing-library/user-event';
import { screen, render, waitFor } from '@testing-library/react';
import JsonView from './';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const example = {
  avatar,
};

it('renders <JsonView /> Container test case', async () => {
  const user = userEvent.setup();
  const divref = React.createRef<HTMLDivElement>();
  const { container } = render(
    <JsonView value={example} ref={divref}>
      <JsonView.Copied data-testid="copied" />
      <JsonView.CountInfo data-testid="countInfo" />
    </JsonView>,
  );
  expect(container.firstElementChild).toBeInstanceOf(Element);
  // 使用新的 act 用法包裹 hover 操作
  await act(async () => {
    await user.hover(container.lastElementChild!);
  });
  const copied = screen.getByTestId('copied');
  expect(copied.style).toHaveProperty('height', '1em');
  expect(copied.style).toHaveProperty('width', '1em');
  expect(copied.style).toHaveProperty('cursor', 'pointer');
  expect(copied.style).toHaveProperty('vertical-align', 'middle');
  expect(copied.style).toHaveProperty('margin-left', '5px');
  // 使用新的 act 用法包裹 unhover 操作
  await act(async () => {
    await user.unhover(container.lastElementChild!);
  });
  const countInfo = screen.getByTestId('countInfo');
  expect(countInfo.nextElementSibling).toBeNull();
  await waitFor(() => {
    expect(divref.current instanceof HTMLDivElement).toBeTruthy();
  });
});
````

## File: core/src/Container.tsx
````typescript
import React, { forwardRef } from 'react';
import { NestedClose } from './comps/NestedClose';
import { NestedOpen } from './comps/NestedOpen';
import { KeyValues } from './comps/KeyValues';
import { useIdCompat } from './comps/useIdCompat';
import { useShowToolsDispatch } from './store/ShowTools';

export interface ContainerProps<T extends object> extends React.HTMLAttributes<HTMLDivElement> {
  keyName?: string | number;
  keyid?: string;
  parentValue?: T;
  level?: number;
  value?: T;
  initialValue?: T;
  /** Index of the parent `keyName` */
  keys?: (string | number)[];
}
export const Container = forwardRef(<T extends object>(props: ContainerProps<T>, ref: React.Ref<HTMLDivElement>) => {
  const {
    className = '',
    children,
    parentValue,
    keyid,
    level = 1,
    value,
    initialValue,
    keys,
    keyName,
    ...elmProps
  } = props;
  const dispatch = useShowToolsDispatch();
  const subkeyid = useIdCompat();
  const defaultClassNames = [className, 'w-rjv-inner'].filter(Boolean).join(' ');
  const reset: React.HTMLAttributes<HTMLDivElement> = {
    onMouseEnter: () => dispatch({ [subkeyid]: true }),
    onMouseLeave: () => dispatch({ [subkeyid]: false }),
  };
  return (
    <div className={defaultClassNames} ref={ref} {...elmProps} {...reset}>
      <NestedOpen
        expandKey={subkeyid}
        value={value}
        level={level}
        keys={keys}
        parentValue={parentValue}
        keyName={keyName}
        initialValue={initialValue}
      />
      <KeyValues
        expandKey={subkeyid}
        value={value}
        level={level}
        keys={keys}
        parentValue={parentValue}
        keyName={keyName}
      />
      <NestedClose expandKey={subkeyid} value={value} level={level} keys={keys} />
    </div>
  );
});

Container.displayName = 'JVR.Container';
````

## File: core/src/index.test.tsx
````typescript
import renderer from 'react-test-renderer';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import JsonView from './';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const longArray = new Array(1000).fill(1);
const example = {
  avatar,
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  // @ts-ignore
  bigint: 10086n,
  null: null,
  undefined,
  timer: 0,
  date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
  array: [19, 100.86, 'test', NaN, Infinity],
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  longArray,
  string_number: '1234',
};

it('renders <JsonView /> test case', () => {
  const component = renderer.create(<JsonView value={example} />);
  let tree = component.toJSON();
  expect(tree).toHaveProperty('type');
  expect(tree).toHaveProperty('props');
  expect(tree).toHaveProperty('children');
  expect(tree).toHaveProperty('type', 'div');
  expect(tree).toHaveProperty('props.className', 'w-json-view-container w-rjv w-rjv-inner');
  expect(tree).toHaveProperty('props.style.backgroundColor', 'var(--w-rjv-background-color, #00000000)');
  expect(tree).toHaveProperty('props.style', {
    lineHeight: 1.4,
    fontSize: 13,
    fontFamily: 'var(--w-rjv-font-family, Menlo, monospace)',
    color: 'var(--w-rjv-color, #002b36)',
    backgroundColor: 'var(--w-rjv-background-color, #00000000)',
  });
  expect(tree).toHaveProperty('props.onMouseEnter');
  expect(tree).toHaveProperty('props.onMouseLeave');
});

it('renders <JsonView objectSortKeys /> test case', () => {
  render(
    <JsonView value={{ b: 1, a: 2 }} objectSortKeys>
      <JsonView.KeyName data-testid="keyname" />
    </JsonView>,
  );
  const keyname = screen.getAllByTestId('keyname')[0];
  expect(keyname.innerHTML).toEqual('a');
});

it('renders <JsonView objectSortKeys={false} /> test case', () => {
  render(
    <JsonView value={{ b: 1, a: 2 }} objectSortKeys={false}>
      <JsonView.KeyName data-testid="keyname" />
    </JsonView>,
  );
  const keyname = screen.getAllByTestId('keyname')[0];
  expect(keyname.innerHTML).toEqual('b');
});

it('renders <JsonView objectSortKeys={() => {}} /> test case', () => {
  render(
    <JsonView
      value={{ bool: 1, a: 2 }}
      objectSortKeys={(a, b, valA, valB) => {
        expect(a).toEqual('a');
        expect(b).toEqual('bool');
        expect(valA).toEqual(2);
        expect(valB).toEqual(1);
        return a.localeCompare(b);
      }}
    >
      <JsonView.KeyName data-testid="keyname" />
    </JsonView>,
  );
  const keyname = screen.getAllByTestId('keyname')[0];
  expect(keyname.innerHTML).toEqual('a');
});
````

## File: core/src/index.tsx
````typescript
import { forwardRef } from 'react';
import { Provider } from './store';
import { Container } from './Container';

import { BraceLeft } from './symbol/BraceLeft';
import { BraceRight } from './symbol/BraceRight';
import { BracketsLeft } from './symbol/BracketsLeft';
import { BracketsRight } from './symbol/BracketsRight';
import { Arrow } from './symbol/Arrow';
import { Colon } from './symbol/Colon';
import { Quote } from './symbol/Quote';
import { ValueQuote } from './symbol/ValueQuote';

import { Bigint } from './types/Bigint';
import { Date } from './types/Date';
import { False } from './types/False';
import { Float } from './types/Float';
import { Int } from './types/Int';
import { Map } from './types/Map';
import { Nan } from './types/Nan';
import { Null } from './types/Null';
import { Set } from './types/Set';
import { StringText } from './types/String';
import { True } from './types/True';
import { Undefined } from './types/Undefined';
import { Url } from './types/Url';

import { Copied } from './section/Copied';
import { CountInfo } from './section/CountInfo';
import { CountInfoExtra } from './section/CountInfoExtra';
import { Ellipsis } from './section/Ellipsis';
import { KeyName } from './section/KeyName';
import { Row } from './section/Row';

export * from './store';
export * from './store/Expands';
export * from './store/ShowTools';
export * from './store/Symbols';
export * from './store/Types';
export * from './symbol/';

export interface JsonViewProps<T extends object>
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** This property contains your input JSON */
  value?: T;
  /** Define the root node name. @default undefined */
  keyName?: string | number;
  /** Whether sort keys through `String.prototype.localeCompare()` @default false */
  objectSortKeys?: boolean | ((keyA: string, keyB: string, valueA: T, valueB: T) => number);
  /** Set the indent-width for nested objects @default 15 */
  indentWidth?: number;
  /** When set to `true`, `objects` and `arrays` are labeled with size @default true */
  displayObjectSize?: boolean;
  /** When set to `true`, data type labels prefix values @default true */
  displayDataTypes?: boolean;
  /** The user can copy objects and arrays to clipboard by clicking on the clipboard icon. @default true */
  enableClipboard?: boolean;
  /** When set to true, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth. @default false */
  collapsed?: boolean | number;
  /** Determine whether the node should be expanded on the first render, or you can use collapsed to control the level of expansion (by default, the root is expanded). */
  shouldExpandNodeInitially?: (
    isExpanded: boolean,
    props: { value?: T; keys: (number | string)[]; level: number },
  ) => boolean;
  /** Whether to highlight updates. @default true */
  highlightUpdates?: boolean;
  /** Shorten long JSON strings, Set to `0` to disable this feature @default 30 */
  shortenTextAfterLength?: number;
  /** When the text exceeds the length, `...` will be displayed. Currently, this `...` can be customized. @default "..." */
  stringEllipsis?: number;
  /** Callback function for when a treeNode is expanded or collapsed */
  onExpand?: (props: { expand: boolean; value?: T; keyid: string; keyName?: string | number }) => void;
  /** Fires event when you copy */
  onCopied?: (text: string, value?: T) => void;
}

type JsonViewComponent = React.FC<React.PropsWithRef<JsonViewProps<object>>> & {
  Bigint: typeof Bigint;
  Date: typeof Date;
  False: typeof False;
  Float: typeof Float;
  Int: typeof Int;
  Map: typeof Map;
  Nan: typeof Nan;
  Null: typeof Null;
  Set: typeof Set;
  String: typeof StringText;
  True: typeof True;
  Undefined: typeof Undefined;
  Url: typeof Url;
  // Symbol
  BraceLeft: typeof BraceLeft;
  BraceRight: typeof BraceRight;
  BracketsLeft: typeof BracketsLeft;
  BracketsRight: typeof BracketsRight;

  Colon: typeof Colon;
  Ellipsis: typeof Ellipsis;
  Quote: typeof Quote;
  ValueQuote: typeof ValueQuote;
  Arrow: typeof Arrow;

  Copied: typeof Copied;
  CountInfo: typeof CountInfo;
  CountInfoExtra: typeof CountInfoExtra;
  KeyName: typeof KeyName;
  Row: typeof Row;
};

const JsonView: JsonViewComponent = forwardRef<HTMLDivElement, JsonViewProps<object>>((props, ref) => {
  const {
    className = '',
    style,
    value,
    children,
    collapsed,
    shouldExpandNodeInitially,
    indentWidth = 15,
    displayObjectSize = true,
    shortenTextAfterLength = 30,
    stringEllipsis,
    highlightUpdates = true,
    enableClipboard = true,
    displayDataTypes = true,
    objectSortKeys = false,
    onExpand,
    onCopied,
    ...elmProps
  } = props;
  const defaultStyle = {
    lineHeight: 1.4,
    fontFamily: 'var(--w-rjv-font-family, Menlo, monospace)',
    color: 'var(--w-rjv-color, #002b36)',
    backgroundColor: 'var(--w-rjv-background-color, #00000000)',
    fontSize: 13,
    ...style,
  } as React.CSSProperties;
  const cls = ['w-json-view-container', 'w-rjv', className].filter(Boolean).join(' ');
  return (
    <Provider
      initialState={{
        value,
        objectSortKeys,
        indentWidth,
        shouldExpandNodeInitially,
        displayObjectSize,
        collapsed,
        enableClipboard,
        shortenTextAfterLength,
        stringEllipsis,
        highlightUpdates,
        onCopied,
        onExpand,
      }}
      initialTypes={{ displayDataTypes }}
    >
      <Container value={value} {...elmProps} ref={ref} className={cls} style={defaultStyle} />
      {children}
    </Provider>
  );
}) as unknown as JsonViewComponent;

JsonView.Bigint = Bigint;
JsonView.Date = Date;
JsonView.False = False;
JsonView.Float = Float;
JsonView.Int = Int;
JsonView.Map = Map;
JsonView.Nan = Nan;
JsonView.Null = Null;
JsonView.Set = Set;
JsonView.String = StringText;
JsonView.True = True;
JsonView.Undefined = Undefined;
JsonView.Url = Url;

JsonView.ValueQuote = ValueQuote;
JsonView.Arrow = Arrow;
JsonView.Colon = Colon;
JsonView.Quote = Quote;
JsonView.Ellipsis = Ellipsis;
JsonView.BraceLeft = BraceLeft;
JsonView.BraceRight = BraceRight;
JsonView.BracketsLeft = BracketsLeft;
JsonView.BracketsRight = BracketsRight;

JsonView.Copied = Copied;
JsonView.CountInfo = CountInfo;
JsonView.CountInfoExtra = CountInfoExtra;
JsonView.KeyName = KeyName;
JsonView.Row = Row;

JsonView.displayName = 'JVR.JsonView';

export default JsonView;
````

## File: core/src/store.tsx
````typescript
import React, { PropsWithChildren, createContext, useContext, useEffect, useReducer } from 'react';
import { JsonViewProps } from './';
import { useShowTools, ShowTools } from './store/ShowTools';
import { useExpands, Expands } from './store/Expands';
import { useTypes, Types, type InitialTypesState, type TagType } from './store/Types';
import { useSymbols, Symbols } from './store/Symbols';
import { useSection, Section } from './store/Section';

export type BlockTagType = keyof JSX.IntrinsicElements;

export interface InitialState<T extends object> {
  value?: object;
  onExpand?: JsonViewProps<object>['onExpand'];
  onCopied?: JsonViewProps<object>['onCopied'];
  objectSortKeys?: JsonViewProps<T>['objectSortKeys'];
  displayObjectSize?: JsonViewProps<T>['displayObjectSize'];
  shortenTextAfterLength?: JsonViewProps<T>['shortenTextAfterLength'];
  stringEllipsis?: JsonViewProps<T>['stringEllipsis'];
  enableClipboard?: JsonViewProps<T>['enableClipboard'];
  highlightUpdates?: JsonViewProps<T>['highlightUpdates'];
  collapsed?: JsonViewProps<T>['collapsed'];
  shouldExpandNodeInitially?: JsonViewProps<T>['shouldExpandNodeInitially'];
  indentWidth?: number;
}

export const initialState: InitialState<object> = {
  objectSortKeys: false,
  indentWidth: 15,
};

type Dispatch = React.Dispatch<InitialState<object>>;

export const Context = createContext<InitialState<object>>(initialState);
Context.displayName = 'JVR.Context';

const DispatchContext = createContext<Dispatch>(() => {});
DispatchContext.displayName = 'JVR.DispatchContext';

export function reducer(state: InitialState<object>, action: InitialState<object>): InitialState<object> {
  return {
    ...state,
    ...action,
  };
}

export const useStore = () => {
  return useContext(Context);
};

export const useDispatchStore = () => {
  return useContext(DispatchContext);
};

export interface ProviderProps<T extends TagType> {
  initialState?: InitialState<object>;
  initialTypes?: InitialTypesState<T>;
}

export const Provider = <T extends TagType>({
  children,
  initialState: init,
  initialTypes,
}: PropsWithChildren<ProviderProps<T>>) => {
  const [state, dispatch] = useReducer(reducer, Object.assign({}, initialState, init));
  const [showTools, showToolsDispatch] = useShowTools();
  const [expands, expandsDispatch] = useExpands();
  const [types, typesDispatch] = useTypes();
  const [symbols, symbolsDispatch] = useSymbols();
  const [section, sectionDispatch] = useSection();
  useEffect(() => dispatch({ ...init }), [init]);
  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ShowTools initial={showTools} dispatch={showToolsDispatch}>
          <Expands initial={expands} dispatch={expandsDispatch}>
            <Types initial={{ ...types, ...initialTypes }} dispatch={typesDispatch}>
              <Symbols initial={symbols} dispatch={symbolsDispatch}>
                <Section initial={section} dispatch={sectionDispatch}>
                  {children}
                </Section>
              </Symbols>
            </Types>
          </Expands>
        </ShowTools>
      </DispatchContext.Provider>
    </Context.Provider>
  );
};

export function useDispatch() {
  return useContext(DispatchContext);
}

Provider.displayName = 'JVR.Provider';
````

## File: core/basic.d.ts
````typescript
declare module '@uiw/react-json-view/basic' {
  export const basicTheme: import('react').CSSProperties;
}
````

## File: core/dark.d.ts
````typescript
declare module '@uiw/react-json-view/dark' {
  export const darkTheme: import('react').CSSProperties;
}
````

## File: core/editor.d.ts
````typescript
/// <reference types="react" />

declare module '@uiw/react-json-view/editor' {
  import { JsonViewProps } from '@uiw/react-json-view';
  // import type { CountInfoExtraProps } from '@uiw/react-json-view/cjs/editor/countInfoExtra';
  type Option = {
    value: string;
    prevValue: string;
    keyName: string | number;
  };

  export interface JsonViewEditorProps<T extends object> extends JsonViewProps<T> {
    /** Callback when value edit functionality */
    onEdit?: (option: {
      value: unknown;
      oldValue: unknown;
      keyName?: string | number;
      parentName?: string | number;
      type?: 'value' | 'key';
    }) => void;
    // /**
    //  * When a callback function is passed in, add functionality is enabled. The callback is invoked before additions are completed.
    //  * @returns {boolean} Returning false from onAdd will prevent the change from being made.
    //  */
    // onAdd?: CountInfoExtraProps<T>['onAdd'];
    // /**
    //  * When a callback function is passed in, delete functionality is enabled. The callback is invoked before deletions are completed.
    //  * @returns Returning false from onDelete will prevent the change from being made.
    //  */
    // onDelete?: CountInfoExtraProps<T>['onDelete'];
    /** Whether enable edit feature. @default true */
    editable?: boolean;
  }
  const JsonViewEditor: import('react').ForwardRefExoticComponent<
    Omit<JsonViewEditorProps<object>, 'ref'> & import('react').RefAttributes<HTMLDivElement>
  >;
  export default JsonViewEditor;
}
````

## File: core/githubDark.d.ts
````typescript
declare module '@uiw/react-json-view/githubDark' {
  export const githubDarkTheme: import('react').CSSProperties;
}
````

## File: core/githubLight.d.ts
````typescript
declare module '@uiw/react-json-view/githubLight' {
  export const githubLightTheme: import('react').CSSProperties;
}
````

## File: core/gruvbox.d.ts
````typescript
declare module '@uiw/react-json-view/gruvbox' {
  export const gruvboxTheme: import('react').CSSProperties;
}
````

## File: core/light.d.ts
````typescript
declare module '@uiw/react-json-view/light' {
  export const lightTheme: import('react').CSSProperties;
}
````

## File: core/monokai.d.ts
````typescript
declare module '@uiw/react-json-view/monokai' {
  export const monokaiTheme: import('react').CSSProperties;
}
````

## File: core/nord.d.ts
````typescript
declare module '@uiw/react-json-view/nord' {
  export const nordTheme: import('react').CSSProperties;
}
````

## File: core/package.json
````json
{
  "name": "@uiw/react-json-view",
  "version": "2.0.0-alpha.33",
  "description": "JSON viewer for react.",
  "main": "cjs/index.js",
  "module": "esm/index.js",
  "homepage": "https://uiwjs.github.io/react-json-view",
  "funding": "https://jaywcjlove.github.io/#/sponsor",
  "exports": {
    "./README.md": "./README.md",
    ".": {
      "import": "./esm/index.js",
      "types": "./cjs/index.d.ts",
      "require": "./cjs/index.js"
    },
    "./editor": {
      "import": "./esm/editor/index.js",
      "types": "./cjs/editor/index.d.ts",
      "require": "./cjs/editor/index.js"
    },
    "./light": {
      "import": "./esm/theme/light.js",
      "types": "./cjs/theme/light.d.ts",
      "require": "./cjs/theme/light.js"
    },
    "./dark": {
      "import": "./esm/theme/dark.js",
      "types": "./cjs/theme/dark.d.ts",
      "require": "./cjs/theme/dark.js"
    },
    "./nord": {
      "import": "./esm/theme/nord.js",
      "types": "./cjs/theme/nord.d.ts",
      "require": "./cjs/theme/nord.js"
    },
    "./vscode": {
      "import": "./esm/theme/vscode.js",
      "types": "./cjs/theme/vscode.d.ts",
      "require": "./cjs/theme/vscode.js"
    },
    "./basic": {
      "import": "./esm/theme/basic.js",
      "types": "./cjs/theme/basic.d.ts",
      "require": "./cjs/theme/basic.js"
    },
    "./monokai": {
      "import": "./esm/theme/monokai.js",
      "types": "./cjs/theme/monokai.d.ts",
      "require": "./cjs/theme/monokai.js"
    },
    "./gruvbox": {
      "import": "./esm/theme/gruvbox.js",
      "types": "./cjs/theme/gruvbox.d.ts",
      "require": "./cjs/theme/gruvbox.js"
    },
    "./githubLight": {
      "import": "./esm/theme/github.light.js",
      "types": "./cjs/theme/github.light.d.ts",
      "require": "./cjs/theme/github.light.js"
    },
    "./githubDark": {
      "import": "./esm/theme/github.dark.js",
      "types": "./cjs/theme/github.dark.d.ts",
      "require": "./cjs/theme/github.dark.js"
    },
    "./triangle-arrow": {
      "import": "./esm/arrow/TriangleArrow.js",
      "types": "./cjs/arrow/TriangleArrow.d.ts",
      "require": "./cjs/arrow/TriangleArrow.js"
    },
    "./triangle-solid-arrow": {
      "import": "./esm/arrow/TriangleSolidArrow.js",
      "types": "./cjs/arrow/TriangleSolidArrow.d.ts",
      "require": "./cjs/arrow/TriangleSolidArrow.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/uiwjs/react-json-view.git"
  },
  "author": "Kenny Wang<wowohoo@qq.com>",
  "license": "MIT",
  "peerDependencies": {
    "@babel/runtime": ">=7.10.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "files": [
    "basic.d.ts",
    "dark.d.ts",
    "editor.d.ts",
    "githubDark.d.ts",
    "githubLight.d.ts",
    "gruvbox.d.ts",
    "light.d.ts",
    "monokai.d.ts",
    "nord.d.ts",
    "triangle-arrow.d.ts",
    "triangle-solid-arrow.d.ts",
    "vscode.d.ts",
    "cjs",
    "esm"
  ],
  "keywords": [
    "array-viewer",
    "component",
    "interactive",
    "interactive-json",
    "json",
    "json-component",
    "json-display",
    "json-tree",
    "json-view",
    "json-viewer",
    "json-inspector",
    "json-tree",
    "react",
    "react-component",
    "react-json",
    "theme",
    "tree",
    "tree-view",
    "treeview"
  ],
  "devDependencies": {
    "@babel/runtime": "^7.22.6",
    "@testing-library/react": "^14.0.0",
    "@types/react-test-renderer": "^18.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-test-renderer": "^18.2.0"
  }
}
````

## File: core/README.md
````markdown
<div markdown="1">
  <sup>Using <a href="https://wangchujiang.com/#/app" target="_blank">my app</a> is also a way to <a href="https://wangchujiang.com/#/sponsor" target="_blank">support</a> me:</sup>
  <br>
    <a target="_blank" href="https://apps.apple.com/app/Vidwall/6747587746" title="Vidwall for macOS"><img align="center" alt="Vidwall" height="52" width="52" src="https://github.com/user-attachments/assets/7b5df70a-ed91-4d4b-85be-f00e60a09ce9"></a>
    <a target="_blank" href="https://wangchujiang.com/mousio-hint/" title="Mousio Hint for macOS"><img align="center" alt="Mousio Hint" height="52" width="52" src="https://github.com/user-attachments/assets/3c0af128-0cef-44e5-a8db-4741dc5a6690"></a>
    <a target="_blank" href="https://apps.apple.com/app/6746747327" title="Mousio for macOS"><img align="center" alt="Mousio" height="52" width="52" src="https://github.com/user-attachments/assets/9edf61ff-5a6c-4676-9cc2-8fd3c1ad0dfb"></a>
    <a target="_blank" href="https://apps.apple.com/app/6745227444" title="Musicer for macOS"><img align="center" alt="Musicer" height="52" width="52" src="https://github.com/user-attachments/assets/b7abfba8-88ff-4c86-a125-43073d5aef22"></a>
    <a target="_blank" href="https://apps.apple.com/app/6743841447" title="Audioer for macOS"><img align="center" alt="Audioer" height="52" width="52" src="https://github.com/user-attachments/assets/7a836865-8c90-4119-87bc-19e06a76c957"></a>
    <a target="_blank" href="https://apps.apple.com/app/6744690194" title="FileSentinel for macOS"><img align="center" alt="FileSentinel" height="52" width="52" src="https://github.com/user-attachments/assets/28bce2cc-290e-45bf-9068-585ff6ecafe9"></a>
    <a target="_blank" href="https://apps.apple.com/app/6743495172" title="FocusCursor for macOS"><img align="center" alt="FocusCursor" height="52" width="52" src="https://github.com/user-attachments/assets/d543668a-737b-4853-a6bb-eaa269e69836"></a>
    <a target="_blank" href="https://apps.apple.com/app/6742680573" title="Videoer for macOS"><img align="center" alt="Videoer" height="52" width="52" src="https://github.com/user-attachments/assets/10ffb0f1-0625-40d6-93f1-2c2496592595"></a>
    <a target="_blank" href="https://apps.apple.com/app/6740425504" title="KeyClicker for macOS"><img align="center" alt="KeyClicker" height="52" width="52" src="https://github.com/user-attachments/assets/5a19fcb9-cb81-4855-b4ea-31c604d9612a"></a>
    <a target="_blank" href="https://apps.apple.com/app/6739052447" title="DayBar for macOS"><img align="center" alt="DayBar" height="52" width="52" src="https://github.com/user-attachments/assets/771b608d-594c-492d-8532-d9231e383f5b"></a>
    <a target="_blank" href="https://apps.apple.com/app/6739444407" title="Iconed for macOS"><img align="center" alt="Iconed" height="52" width="52" src="https://github.com/user-attachments/assets/8a35dc7b-4faf-4e2a-9311-f66d6844a896"></a>
    <a target="_blank" href="https://apps.apple.com/app/6737160756" title="RightMenu Master for macOS"><img align="center" alt="RightMenu Master" height="52" width="52" src="https://github.com/user-attachments/assets/39a76541-71bf-4de7-a01c-c62f0557dff5"></a>
    <a target="_blank" href="https://apps.apple.com/app/6723903021" title="Paste Quick for macOS"><img align="center" alt="Quick RSS" height="52" width="52" src="https://github.com/user-attachments/assets/bdaad5b7-9810-44ce-8f17-8410864465d2"></a>
    <a target="_blank" href="https://apps.apple.com/app/6670696072" title="Quick RSS for macOS/iOS"><img align="center" alt="Quick RSS" height="52" width="52" src="https://github.com/user-attachments/assets/374106b5-a448-4d1d-9ccb-b04b6bc681ed"></a>
    <a target="_blank" href="https://apps.apple.com/app/6670167443" title="Web Serve for macOS"><img align="center" alt="Web Serve" height="52" width="52" src="https://github.com/user-attachments/assets/e1d9f76f-0f3d-4ba5-8a15-253ee173bb1c"></a>
    <a target="_blank" href="https://apps.apple.com/app/6503953628" title="Copybook Generator for macOS/iOS"><img align="center" alt="Copybook Generator" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/b90e42ff-158b-4534-82ca-5898fd0e8d73"></a>
    <a target="_blank" href="https://apps.apple.com/app/6471227008" title="DevTutor for macOS/iOS"><img align="center" alt="DevTutor for SwiftUI" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/f15c154d-0192-48eb-8e0e-9e245ffd974a"></a>
    <a target="_blank" href="https://apps.apple.com/app/6479819388" title="RegexMate for macOS/iOS"><img align="center" alt="RegexMate" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/aabe5aa9-9a96-4390-8bed-c3e4023d0dea"></a>
    <a target="_blank" href="https://apps.apple.com/app/6479194014" title="Time Passage for macOS/iOS"><img align="center" alt="Time Passage" height="52" width="52" src="https://github.com/jaywcjlove/time-passage/assets/1680273/6f30e429-e6f3-4dbe-9921-a5effe2a05e9"></a>
    <a target="_blank" href="https://apps.apple.com/app/6478772538" title="IconizeFolder for macOS"><img align="center" alt="Iconize Folder" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/fa9d8b9c-1e51-4ded-877c-fa5b21c47220"></a>
    <a target="_blank" href="https://apps.apple.com/app/6478511402" title="Textsound Saver for macOS/iOS"><img align="center" alt="Textsound Saver" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/0595e842-980b-4574-8891-a8ba853a08be"></a>
    <a target="_blank" href="https://apps.apple.com/app/6476924627" title="Create Custom Symbols for macOS"><img align="center" alt="Create Custom Symbols" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/8cd022ce-a3f1-4e89-b7c6-6fbd0d4db77c"></a>
    <a target="_blank" href="https://apps.apple.com/app/6476452351" title="DevHub for macOS"><img align="center" alt="DevHub" height="52" width="52" src="https://github.com/user-attachments/assets/4a44a4fd-67ce-430b-af0a-72f18feaa47d"></a>
    <a target="_blank" href="https://apps.apple.com/app/6476400184" title="Resume Revise for macOS"><img align="center" alt="Resume Revise" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/c9954a20-1905-48de-bdf8-d71837974aa2"></a>
    <a target="_blank" href="https://apps.apple.com/app/6472593276" title="Palette Genius for macOS"><img align="center" alt="Palette Genius" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/27340413-d355-45b2-8f6f-6ac37682d957"></a>
    <a target="_blank" href="https://apps.apple.com/app/6470879005" title="Symbol Scribe for macOS"><img align="center" alt="Symbol Scribe" height="52" width="52" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/c7249f05-fa70-4def-a1e9-571d5f171fc9"></a>
  <br><br>
</div>
<hr>


react-json-view
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![CI](https://github.com/uiwjs/react-json-view/actions/workflows/ci.yml/badge.svg)](https://github.com/uiwjs/react-json-view/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@uiw/react-json-view.svg)](https://www.npmjs.com/package/@uiw/react-json-view)
[![NPM Downloads](https://img.shields.io/npm/dm/@uiw/react-json-view.svg?style=flat&label=)](https://www.npmjs.com/package/@uiw/react-json-view)
[![react@^18](https://shields.io/badge/react-^18-green?style=flat&logo=react)](https://github.com/facebook/react/releases)
[![Coverage Status](https://uiwjs.github.io/react-json-view/badges.svg)](https://uiwjs.github.io/react-json-view/lcov-report/)

A React component for displaying and editing javascript arrays and JSON objects. Preview of [**v1 documentation**](https://raw.githack.com/uiwjs/react-json-view/v1-docs/index.html) is available [here](https://raw.githack.com/uiwjs/react-json-view/v1-docs/index.html).

<!--rehype:ignore:start-->
<a href="https://uiwjs.github.io/react-json-view/" target="_blank">
  <img width="650" alt="react-json-view" src="https://github.com/uiwjs/react-json-view/assets/1680273/1c19bd72-f2ad-4d21-8708-cb30f3059cfd" />
</a>

<!--rehype:ignore:end-->

## Features

🚀 **Improved with TypeScript** – Better code hints for a smoother development experience.
🎨 **Customizable Themes** – Supports theme customization & [`online editing`](https://uiwjs.github.io/react-json-view/#online-editing-theme).
🌒 **Dark/Light Mode** – Seamless switching between themes.
📦 **Zero Dependencies** – Lightweight and efficient.
📋 **Clipboard Support** – Easily copy JSON data.
✏️ **Editable & Extendable** – Supports editing and adding new properties.
♻️ **Update Highlighting** – Option to highlight changes.

The latest version [**v2**](https://uiwjs.github.io/react-json-view/) features a redesigned API for better maintainability, a more flexible component customization system, and fully customizable rendering, making it more aligned with React’s component model. 📖 Check out the [v2 documentation](https://uiwjs.github.io/react-json-view/) and [examples](https://uiwjs.github.io/react-json-view/).

- [x] Fully implemented all v1 JSON display features.
- [ ] Adding editing functionality to v2.
- [x] Added comprehensive test cases for v2.

## Quick Start

```bash
npm install @uiw/react-json-view
```

```jsx
import JsonView from '@uiw/react-json-view';
import JsonViewEditor from '@uiw/react-json-view/editor';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';
```

```jsx
import JsonView from '@uiw/react-json-view';

const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
const longArray = new Array(1000).fill(1);
const example = {
  avatar,
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  bigint: 10086n,
  null: null,
  undefined,
  timer: 0,
  date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
  array: [19, 100.86, 'test', NaN, Infinity],
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  longArray,
  string_number: '1234',
};

<JsonView value={example} />
```

## Theme

By default, the `lightTheme` light theme is used, and a `darkTheme` dark theme configuration is built in

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { nordTheme } from '@uiw/react-json-view/nord';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { basicTheme } from '@uiw/react-json-view/basic';

const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  boolean: true,
  null: null,
  nan: NaN,
  url: new URL('https://example.com'),
}

const style = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' };

export default function Demo() {
  return (
    <div style={style}>
      <JsonView value={object} style={darkTheme} />
      <JsonView value={object} style={lightTheme} />
      <JsonView value={object} style={nordTheme} />
      <JsonView value={object} style={githubLightTheme} />
      <JsonView value={object} style={githubDarkTheme} />
      <JsonView value={object} style={gruvboxTheme} />
      <JsonView value={object} style={vscodeTheme} />
      <JsonView value={object} style={monokaiTheme} />
      <JsonView value={object} style={basicTheme} />
    </div>
  );
}
```

Example of custom `vscode` theme styles:

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
}
const customTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#9cdcfe',
  '--w-rjv-key-number': '#268bd2',
  '--w-rjv-key-string': '#9cdcfe',
  '--w-rjv-background-color': '#1e1e1e',
  '--w-rjv-line-color': '#36334280',
  '--w-rjv-arrow-color': '#838383',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#9c9c9c7a',
  '--w-rjv-update-color': '#9cdcfe',
  '--w-rjv-copied-color': '#9cdcfe',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#d4d4d4',
  '--w-rjv-colon-color': '#d4d4d4',
  '--w-rjv-brackets-color': '#d4d4d4',
  '--w-rjv-ellipsis-color': '#cb4b16',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#ce9178',
  '--w-rjv-type-int-color': '#b5cea8',
  '--w-rjv-type-float-color': '#b5cea8',
  '--w-rjv-type-bigint-color': '#b5cea8',
  '--w-rjv-type-boolean-color': '#569cd6',
  '--w-rjv-type-date-color': '#b5cea8',
  '--w-rjv-type-url-color': '#3b89cf',
  '--w-rjv-type-null-color': '#569cd6',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#569cd6',
};

export default function Demo() {
  return (
    <JsonView value={object} keyName="root" style={customTheme} />
  )
}
```

## Online Editing Theme

Online custom style example, please check in the [documentation website](https://uiwjs.github.io/react-json-view/)

```tsx mdx:preview:&title=Online Editing Theme
import React, { useState, useEffect } from 'react';
import Colorful from '@uiw/react-color-colorful';
import JsonView from '@uiw/react-json-view';

const object = {
  avatar: 'https://i.imgur.com/MK3eW3As.jpg',
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  bigint: 10086n,
  null: null,
  undefined,
  timer: 0,
  nan: NaN,
  url: new URL('https://example.com'),
  date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
  array: [19, 100.86, 'test', NaN, Infinity],
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  string_number: '1234',
}
const customTheme = {
  '--w-rjv-color': '#9cdcfe',
  '--w-rjv-key-number': '#268bd2',
  '--w-rjv-key-string': '#9cdcfe',
  '--w-rjv-background-color': '#1e1e1e',
  '--w-rjv-line-color': '#36334280',
  '--w-rjv-arrow-color': '#838383',
  '--w-rjv-edit-color': '#9cdcfe',
  '--w-rjv-info-color': '#9c9c9c7a',
  '--w-rjv-update-color': '#9cdcfe',
  '--w-rjv-copied-color': '#9cdcfe',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#d4d4d4',
  '--w-rjv-colon-color': '#d4d4d4',
  '--w-rjv-brackets-color': '#d4d4d4',
  '--w-rjv-ellipsis-color': '#cb4b16',
  '--w-rjv-quotes-color': '#9cdcfe',
  '--w-rjv-quotes-string-color': '#ce9178',

  '--w-rjv-type-string-color': '#ce9178',
  '--w-rjv-type-int-color': '#b5cea8',
  '--w-rjv-type-float-color': '#b5cea8',
  '--w-rjv-type-bigint-color': '#b5cea8',
  '--w-rjv-type-boolean-color': '#569cd6',
  '--w-rjv-type-date-color': '#b5cea8',
  '--w-rjv-type-url-color': '#3b89cf',
  '--w-rjv-type-null-color': '#569cd6',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#569cd6',
};

export default function Demo() {
  const [cssvar, setCssvar] = useState('--w-rjv-background-color');
  const [hex, setHex] = useState("#1e1e1e");
  const [editable, setEditable] = useState(false);
  const [theme, setTheme] = useState(customTheme);
  const onChange = ({ hexa }) => {
    setHex(hexa);
    setTheme({ ...theme, [cssvar]: hexa });
  };

  const [src, setSrc] = useState({ ...object })
  useEffect(() => {
    const loop = () => {
      setSrc(src => ({
        ...src,
        timer: src.timer + 1
      }))
    }
    const id = setInterval(loop, 1000)
    return () => clearInterval(id)
  }, []);

  const changeEditable = (evn) => setEditable(evn.target.checked);
  return (
    <React.Fragment>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <JsonView
          // editable={editable}
          value={src}
          keyName="root"
          style={{ flex: 1, overflow: 'auto', ...theme }}
        />
        <div>
          <Colorful color={hex} onChange={onChange} />
          <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', ...customTheme }}>
            {Object.keys(customTheme).map((varname, idx) => {
              const click = () => {
                setCssvar(varname);
                setHex(customTheme[varname]);
              };
              const active = cssvar === varname ? '#a8a8a8' : '';
              return (
                <button key={idx}
                  style={{ background: active, border: 0,boxShadow: 'inset 0px 0px 1px #000', display: 'flex', alignItems: 'center', gap: 5, padding: '1px 3px' }}
                  onClick={click}
                >
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: `var(${varname})` }}></span>
                  {varname}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div>
        Copy the theme configuration below into your project.
      </div>
      <pre style={{ padding: 10 }}>
        {JSON.stringify(theme, null, 2)}
      </pre>
    </React.Fragment>
  );
}
```

## Render

**`v2`** version allows flexible customization of each "part" by providing small sub-components for customization, including value and type components: `<Bigint />`, `<Date />`, `<False />`, `<Float />`, `<Int />`, `<Map />`, `<Nan />`, `<Null />`, `<Set />`, `<String />`, `<True />`, `<Undefined />`, `<Url />`, and symbol components: `<ValueQuote />`, `<Arrow />`, `<Colon />`, `<Quote />`, `<BraceLeft />`, `<BraceRight />`, `<BracketsLeft />`, `<BracketsRight />`.

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

const object = {
  avatar: 'https://i.imgur.com/MK3eW3As.jpg',
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
}

export default function Demo() {
  return (
    <JsonView
      value={object}
      keyName="root"
      displayObjectSize={false}
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
    >
      <JsonView.String
        render={({ children, ...reset }, { type, value, keyName }) => {
          const isImg = /^https?.*\.(jpg|png)$/i.test(value)
          if (type === 'type' && isImg) {
            return <span />
          }
          if (type === 'value' && isImg) {
            return <img {...reset} height="26" src={value} />
          }
        }}
      />
      <JsonView.Colon> -&gt; </JsonView.Colon>
    </JsonView>
  )
}
```

**Support for the URL(opens in a new tab) API.**

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

export default function Demo() {
  return (
    <JsonView
      value={{
        url: new URL('https://example.com?t=12'),
        urlStr: "https://example.com",
        github: "https://example.com",
      }}
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
    />
  )
}
```

Supports certain partial customizations such as: `<Copied />`, `<CountInfo />`, `<CountInfoExtra />`, `<Ellipsis />`, `<KeyName />`, `<Row />`

```tsx mdx:preview
import React, { Fragment } from 'react';
import JsonView, { ValueQuote } from '@uiw/react-json-view';

const Copied = JsonView.Copied;

export default function Demo() {
  return (
    <JsonView
      value={{
        url: new URL('https://example.com?t=12'),
        urlStr: "https://example.com",
        github: "https://example.com",
      }}
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
    >
      <Copied
        render={({ 'data-copied': copied, style, onClick, ...props }, { value }) => {
          const styl = { whiteSpace: 'nowrap' }
          if (copied) {
            return <span style={{ ...style, ...styl }}>复制成功</span>
          }
          return <span style={{ ...style, ...styl }} onClick={onClick}>复制</span>
        }}
      />
      <JsonView.Url
        render={(props, { type, value }) => {
          if (type === 'type' && value instanceof URL) {
            return <span />
          }
          if (type === 'value' && value instanceof URL) {
            return (
              <Fragment>
                <a href={value.href} target="_blank" {...props}>
                  <ValueQuote />
                  {value.href}
                  <ValueQuote />
                </a>
                Open URL
              </Fragment>
            );
          }
        }}
      />
    </JsonView>
  )
}
```

More in-depth customization ([#19](https://github.com/uiwjs/react-json-view/issues/19))

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

const object = {
  _id: "ObjectId('13212hakjdhajksd')",
  uid: "test1",
  attival_time: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
  __v: 0
}

export default function Demo() {
  return (
    <JsonView
      value={object}
      // keyName="root"
      displayObjectSize={false}
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
    >
      <JsonView.Quote render={() => <span />}/>
      <JsonView.String
        render={({ children, ...reset }, { type, value, keyName }) => {
          if (type === 'type') {
            return <span />
          }
          if (type === 'value' && /ObjectId\(['"](.*?)['"]\)/.test(value)) {
            return <span {...reset}>{children}</span>
          }
        }}
      />
      <JsonView.Date
        render={({ children, ...reset }, { type, value, keyName }) => {
          if (type === 'type') {
            return <span />
          }
        }}
      />
      <JsonView.Int
        render={({ children, ...reset }, { type, value, keyName }) => {
          if (type === 'type') {
            return <span />
          }
        }}
      />
    </JsonView>
  )
}
```

Inspector

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

const object = [
  {
    "_id": "56dcf573b09c217d39fd7621",
    "name": "Howard Christensen",
    "email": "howardchristensen@gmail.com",
    "phone": "+1 (830) 529-3176",
    "address": "511 Royce Street, Hilltop, Tennessee, 9712"
  },
  {
    "_id": "56dcf57323630b06251e93cd",
    "name": "Eleanor Lynn",
    "email": "eleanorlynn@gmail.com",
    "phone": "+1 (911) 576-2345",
    "address": "547 Dearborn Court, Trona, California, 8629"
  },
  {
    "_id": "56dcf5738279cac6b081e512",
    "name": "Baxter Mooney",
    "email": "baxtermooney@gmail.com",
    "phone": "+1 (954) 456-3456",
    "address": "349 Cumberland Walk, Washington, Alaska, 3154"
  },
  {
    "_id": "56dcf57303accabd43740957",
    "name": "Calhoun Tyson",
    "email": "calhountyson@gmail.com",
    "phone": "+1 (818) 456-2529",
    "address": "367 Lyme Avenue, Ladera, Louisiana, 6292"
  },
]

const customTheme = {
  '--w-rjv-background-color': '#fff',
  '--w-rjv-border-left-width': 0,
  '--w-rjv-color': '#881391',
  '--w-rjv-type-int-color': '#881391',
  '--w-rjv-key-number': '#881391',
  '--w-rjv-key-string': '#881391',
};

const Quote = JsonView.Quote;
const BraceLeft = JsonView.BraceLeft;
const BraceRight = JsonView.BraceRight;
const CountInfo = JsonView.CountInfo;
const Ellipsis = JsonView.Ellipsis;
const CountInfoExtra = JsonView.CountInfoExtra;

export default function Demo() {
  return (
    <JsonView
      value={object}
      style={customTheme}
      enableClipboard={false}
      displayDataTypes={false}
    >
      <Ellipsis
        render={({ 'data-expanded': isExpanded, className, ...props }, { value }) => {
          if (Array.isArray(value) && isExpanded) {
            console.log('props:',value, isExpanded, props)
            return (
              <span className={className}>
                {Array.from({ length: value.length }, () => 'Object').join(', ')}
              </span>
            )
          }
          return <span />;
        }}
      />
      <Quote>
        <span />
      </Quote>
      <BraceLeft>
        <span />
      </BraceLeft>
      <BraceRight>
        <span />
      </BraceRight>
      <CountInfo
        render={({ 'data-length': length, ...props }, { value }) => {
          const isArray = Array.isArray(value);
          if (isArray) return <span />;
          return (
            <span {...props}>Object</span>
          );
        }}
      />
    </JsonView>
  );
}
```

Passing **as="tagName"** will automatically infer the type.

```tsx
<JsonView.CountInfo
  as="del"
  render={(props, { value, keyName }) => {
    if (keyName === 'integer' && typeof value === 'number' && value > 10) {
      console.log('value:',  value, props)
      return <del {...props}>{keyName}</del>;
    }
  }}
/>
```

Add a click event on the data row

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';

export default function Demo() {
  return (
    <JsonView
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
      value={{
        name: 'John',
        age: 30,
        hobbies: ['reading', 'coding', 'swimming'],
        address: {
            street: '123 Main St',
            city: 'New York',
            country: {
                name: 'Main ',
                codex: '123'
            }
        }
      }}
    >
      <JsonView.Row
        as="div"
        render={(props, { keyName, value, parentValue }) => {
          return (
            <div
              {...props}
              onClick={() => {
                console.log("keyName", keyName)
                console.log("value", value)
                console.log("parentValue", parentValue)
              }}
            />
          )
        }}
      />
    </JsonView>
  )
}
```

## Highlight Updates

```tsx mdx:preview
import React, { useState, useEffect } from 'react';
import JsonView from '@uiw/react-json-view';

const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  timer: 0,
  object: { 'first-child': true, 'second-child': false, 'last-child': null },
}
export default function Demo() {
  const [src, setSrc] = useState({ ...object })
  useEffect(() => {
    const loop = () => {
      setSrc(src => ({
        ...src,
        timer: src.timer + 1
      }))
    }
    const id = setInterval(loop, 1000)
    return () => clearInterval(id)
  }, []);

  return (
    <JsonView
      value={src}
      keyName="root"
      style={{
        '--w-rjv-background-color': '#ffffff',
        '--w-rjv-border-left': '1px dashed #ebebeb',
        // ✅ Change default update background color ✅
        '--w-rjv-update-color': '#ff6ffd',
      }}
    />
  )
}
```

This feature can be disabled with `highlightUpdates={false}`, and the default color can be changed with `--w-rjv-update-color`.

## Do not display array index

```tsx mdx:preview
import React, { Fragment } from 'react';
import JsonView from '@uiw/react-json-view';

export default function Demo() {
  const value = { data: ["123", 23] }
  return (
    <JsonView value={value} style={{ '--w-rjv-background-color': '#ffffff' }}>
        <JsonView.Colon render={(props, { parentValue, value, keyName }) => {
            if (Array.isArray(parentValue) && props.children == ":") {
              return <span />
            }
            return <span {...props} />
        }}/>
        <JsonView.KeyName
          render={({ ...props }, { type, parentValue, value, keyName }) => {
            if (Array.isArray(parentValue) && Number.isFinite( props.children)) {
              return <span />
            }
            return <span {...props} />
          }}
        />
    </JsonView>
  )
}
```

## Default Collapse/Expand

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';
const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
}
export default function Demo() {
  return (
    <JsonView
      value={object}
      collapsed={2}
      shouldExpandNodeInitially={(isExpanded, { value, keys, level }) => {
        if (keys.length > 0 && keys[0] == "object") {
          return false
        }
        return isExpanded
      }}
      style={{
        '--w-rjv-background-color': '#ffffff',
      }}
    >
    </JsonView>
  )
}
```

## Modify Icon Style

Use built-in default icons.

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';

const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
}
export default function Demo() {
  return (
    <JsonView
      value={object}
      keyName="root"
      style={{
        '--w-rjv-background-color': '#ffffff',
        '--w-rjv-border-left': '1px dashed #ebebeb',
      }}
    >
      <JsonView.Arrow>
        <TriangleSolidArrow />
      </JsonView.Arrow>
    </JsonView>
  )
}
```

Display of custom **svg** `icon` components

```tsx mdx:preview
import React from 'react';
import JsonView from '@uiw/react-json-view';
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';

const object = {
  string: 'Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  nestedArray: [
    [1, 2],
    [3, 4],
  ],
}
export default function Demo() {
  return (
    <JsonView
      value={object}
      keyName="root"
      style={{
        '--w-rjv-background-color': '#ffffff',
        '--w-rjv-border-left': '1px dashed #ebebeb',
      }}
    >
      <JsonView.Arrow
        render={({ 'data-expanded': isExpanded, ...props }) => {
          const svgProps = {
            style: {
              cursor: 'pointer', height: '1em', width: '1em', marginRight: 5, userSelect: 'none'
            },
            fill: "var(--w-rjv-arrow-color, currentColor)"
          }
          if (!isExpanded) {
            return (
              <svg viewBox="0 0 24 24" {...svgProps}>
                <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
              </svg>
            );
          }
          return (
            <svg viewBox="0 0 24 24" {...svgProps}>
              <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7" />
            </svg>
          );
        }}
      />
    </JsonView>
  );
}
```

## Props

Migrate from JSON View v1 to v2. The new v2 version has removed the ~~`quotes`~~ and ~~`components`~~ props.

```diff
export interface JsonViewProps<T extends object> extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
-  quotes?: "'" | '"' | '';
-  components?: {};
}
```

```ts
export interface JsonViewProps<T extends object> extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** This property contains your input JSON */
  value?: T;
  /** Define the root node name. @default undefined */
  keyName?: string | number;
  /** Whether sort keys through `String.prototype.localeCompare()` @default false */
  objectSortKeys?: boolean | ((keyA: string, keyB: string, valueA: T, valueB: T) => number);
  /** Set the indent-width for nested objects @default 15 */
  indentWidth?: number;
  /** When set to `true`, `objects` and `arrays` are labeled with size @default true */
  displayObjectSize?: boolean;
  /** When set to `true`, data type labels prefix values @default true */
  displayDataTypes?: boolean;
  /** The user can copy objects and arrays to clipboard by clicking on the clipboard icon. @default true */
  enableClipboard?: boolean;
  /** When set to true, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth. @default false */
  collapsed?: boolean | number;
  /** Determine whether the node should be expanded on the first render, or you can use collapsed to control the level of expansion (by default, the root is expanded). */
  shouldExpandNodeInitially?: (
    isExpanded: boolean,
    props: { value?: T; keys: (number | string)[]; level: number },
  ) => boolean;
  /** Whether to highlight updates. @default true */
  highlightUpdates?: boolean;
  /** Shorten long JSON strings, Set to `0` to disable this feature @default 30 */
  shortenTextAfterLength?: number;
  /** When the text exceeds the length, `...` will be displayed. Currently, this `...` can be customized. @default "..." */
  stringEllipsis?: number;
  /** Callback function for when a treeNode is expanded or collapsed */
  onExpand?: (props: { expand: boolean; value?: T; keyid: string; keyName?: string | number }) => void;
  /** Fires event when you copy */
  onCopied?: (text: string, value?: T) => void;
}
```

```ts
import { BraceLeft } from './symbol/BraceLeft';
import { BraceRight } from './symbol/BraceRight';
import { BracketsLeft } from './symbol/BracketsLeft';
import { BracketsRight } from './symbol/BracketsRight';
import { Arrow } from './symbol/Arrow';
import { Colon } from './symbol/Colon';
import { Quote } from './symbol/Quote';
import { ValueQuote } from './symbol/ValueQuote';

import { Bigint } from './types/Bigint';
import { Date } from './types/Date';
import { False } from './types/False';
import { Float } from './types/Float';
import { Int } from './types/Int';
import { Map } from './types/Map';
import { Nan } from './types/Nan';
import { Null } from './types/Null';
import { Set } from './types/Set';
import { StringText } from './types/String';
import { True } from './types/True';
import { Undefined } from './types/Undefined';
import { Url } from './types/Url';

import { Copied } from './section/Copied';
import { CountInfo } from './section/CountInfo';
import { CountInfoExtra } from './section/CountInfoExtra';
import { Ellipsis } from './section/Ellipsis';
import { KeyName } from './section/KeyName';
import { Row } from './section/Row';

type JsonViewComponent = React.FC<React.PropsWithRef<JsonViewProps<object>>> & {
  BraceLeft: typeof BraceLeft;
  BraceRight: typeof BraceRight;
  BracketsLeft: typeof BracketsLeft;
  BracketsRight: typeof BracketsRight;
  Arrow: typeof Arrow;
  Colon: typeof Colon;
  Quote: typeof Quote;
  ValueQuote: typeof ValueQuote;

  Bigint: typeof Bigint;
  Date: typeof Date;
  False: typeof False;
  Float: typeof Float;
  Int: typeof Int;
  Map: typeof Map;
  Nan: typeof Nan;
  Null: typeof Null;
  Set: typeof Set;
  String: typeof StringText;
  True: typeof True;
  Undefined: typeof Undefined;
  Url: typeof Url;

  Copied: typeof Copied;
  CountInfo: typeof CountInfo;
  CountInfoExtra: typeof CountInfoExtra;
  Ellipsis: typeof Ellipsis;
  KeyName: typeof KeyName;
  Row: typeof Row;
};
declare const JsonView: JsonViewComponent;
export default JsonView;
```

## Size and dependencies

Here is the size benchmark (using [bundlephobia.com](https://bundlephobia.com)) against similar React libraries (found by [`npmjs.com/search`](https://www.npmjs.com/search?q=react%20json&ranking=popularity)):

| Library | Bundle size (gzip) | Deps | Last commit | Download | Editable | Demo |
| ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| **[@uiw/react-json-view](https://github.com/uiwjs/react-json-view)** | [![](https://img.shields.io/bundlephobia/min/@uiw/react-json-view?color=6ead0a&label=)](https://bundlephobia.com/result?p=@uiw/react-json-view) [![](https://img.shields.io/bundlephobia/minzip/@uiw/react-json-view?color=6ead0a&label=gzip)](https://bundlephobia.com/result?p=@uiw/react-json-view) | [![](https://badgen.net/bundlephobia/dependency-count/%40uiw%2Freact-json-view?color=6ead0a&label=)](https://bundlephobia.com/result?p=@uiw/react-json-view) | [![GitHub last commit](https://img.shields.io/github/last-commit/uiwjs/react-json-view?style=flat&label=)](https://github.com/uiwjs/react-json-view/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/@uiw/react-json-view.svg?style=flat&label=)](https://www.npmjs.com/package/@uiw/react-json-view) | ✅ | [demo](https://uiwjs.github.io/react-json-view/) |
| [react-json-view-lite](https://github.com/anyroad/react-json-view-lite) | [![](https://img.shields.io/bundlephobia/min/react-json-view-lite?color=red&label=)](https://bundlephobia.com/result?p=react-json-view-lite) [![](https://img.shields.io/bundlephobia/minzip/react-json-view-lite?color=red&label=gzip)](https://bundlephobia.com/result?p=react-json-view-lite) | [![](https://badgen.net/bundlephobia/dependency-count/react-json-view-lite?color=red&label=)](https://bundlephobia.com/result?p=react-json-view-lite) | [![GitHub last commit](https://img.shields.io/github/last-commit/AnyRoad/react-json-view-lite?style=flat&label=)](https://github.com/AnyRoad/react-json-view-lite/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-json-view-lite.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-json-view-lite) | ❌ | [demo](https://anyroad.github.io/react-json-view-lite/) |
| [react-json-pretty](https://github.com/chenckang/react-json-pretty) | [![](https://img.shields.io/bundlephobia/min/react-json-pretty?color=red&label=)](https://bundlephobia.com/result?p=react-json-pretty) [![](https://img.shields.io/bundlephobia/minzip/react-json-pretty?color=red&label=gzip)](https://bundlephobia.com/result?p=react-json-pretty) | [![](https://badgen.net/bundlephobia/dependency-count/react-json-pretty?color=red&label=)](https://bundlephobia.com/result?p=react-json-pretty) | [![GitHub last commit](https://img.shields.io/github/last-commit/chenckang/react-json-pretty?style=flat&label=)](https://github.com/chenckang/react-json-pretty/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-json-pretty.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-json-pretty) | ❌ | - |
| [~~react-json-inspector~~](https://github.com/Lapple/react-json-inspector) | [![](https://img.shields.io/bundlephobia/min/react-json-inspector?color=red&label=)](https://bundlephobia.com/result?p=react-json-inspector) [![](https://img.shields.io/bundlephobia/minzip/react-json-inspector?color=red&label=gzip)](https://bundlephobia.com/result?p=react-json-inspector) | [![](https://badgen.net/bundlephobia/dependency-count/react-json-inspector?color=red&label=)](https://bundlephobia.com/result?p=react-json-inspector) | [![GitHub last commit](https://img.shields.io/github/last-commit/Lapple/react-json-inspector?style=flat&label=)](https://github.com/Lapple/react-json-inspector/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-json-inspector.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-json-inspector) | ❌ | [demo](https://lapple.github.io/react-json-inspector/)
| [react-json-tree](https://github.com/reduxjs/redux-devtools/tree/main/packages/react-json-tree) | [![](https://img.shields.io/bundlephobia/min/react-json-tree?color=red&label=)](https://bundlephobia.com/result?p=react-json-tree) [![](https://img.shields.io/bundlephobia/minzip/react-json-tree?color=red&label=gzip)](https://bundlephobia.com/result?p=react-json-tree) | [![](https://badgen.net/bundlephobia/dependency-count/react-json-tree?color=red&label=)](https://bundlephobia.com/result?p=react-json-tree) | [![GitHub last commit](https://img.shields.io/github/last-commit/reduxjs/redux-devtools?style=flat&label=)](https://github.com/reduxjs/redux-devtools/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-json-tree.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-json-tree) | ❌ |
| ~~[react-json-view](https://github.com/mac-s-g/react-json-view)~~ | [![](https://img.shields.io/bundlephobia/min/react-json-view?color=red&label=)](https://bundlephobia.com/result?p=react-json-view) [![](https://img.shields.io/bundlephobia/minzip/react-json-view?color=red&label=gzip)](https://bundlephobia.com/result?p=react-json-view) | [![](https://badgen.net/bundlephobia/dependency-count/react-json-view?color=red&label=&t=123)](https://bundlephobia.com/result?p=react-json-view) | [![GitHub last commit](https://img.shields.io/github/last-commit/mac-s-g/react-json-view?style=flat&label=)](https://github.com/mac-s-g/react-json-view/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-json-view.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-json-view) | ✅ | [demo](https://mac-s-g.github.io/react-json-view/demo/dist/) |
| [react-inspector](https://github.com/storybookjs/react-inspector) | [![](https://img.shields.io/bundlephobia/min/react-inspector?color=red&label=)](https://bundlephobia.com/result?p=react-inspector) [![](https://img.shields.io/bundlephobia/minzip/react-inspector?color=red&label=gzip)](https://bundlephobia.com/result?p=react-inspector) | [![](https://badgen.net/bundlephobia/dependency-count/react-inspector?color=red&label=)](https://bundlephobia.com/result?p=react-inspector) | [![GitHub last commit](https://img.shields.io/github/last-commit/storybookjs/react-inspector?style=flat&label=)](https://github.com/storybookjs/react-inspector/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-inspector.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-inspector) | ❌ | [demo](https://react-inspector.netlify.app/) |
| [react-domify](https://github.com/JedWatson/react-domify) | [![](https://img.shields.io/bundlephobia/min/react-domify?color=red&label=)](https://bundlephobia.com/result?p=react-domify) [![](https://img.shields.io/bundlephobia/minzip/react-domify?color=red&label=gzip)](https://bundlephobia.com/result?p=react-domify) | [![](https://badgen.net/bundlephobia/dependency-count/react-domify?color=red&label=)](https://bundlephobia.com/result?p=react-domify) | [![GitHub last commit](https://img.shields.io/github/last-commit/JedWatson/react-domify?style=flat&label=)](https://github.com/JedWatson/react-domify/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-domify.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-domify) | ❌ | [demo](https://jedwatson.github.io/react-domify/) |
| [react18-json-view](https://github.com/YYsuni/react18-json-view) | [![](https://img.shields.io/bundlephobia/min/react18-json-view?color=red&label=)](https://bundlephobia.com/result?p=react18-json-view) [![](https://img.shields.io/bundlephobia/minzip/react18-json-view?color=red&label=gzip)](https://bundlephobia.com/result?p=react18-json-view) | [![](https://badgen.net/bundlephobia/dependency-count/react18-json-view?color=red&label=)](https://bundlephobia.com/result?p=react18-json-view) | [![GitHub last commit](https://img.shields.io/github/last-commit/YYsuni/react18-json-view?style=flat&label=)](https://github.com/YYsuni/react18-json-view/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react18-json-view.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react18-json-view) | ❌ | [demo](https://jv.yysuni.com/) |
| [@textea/json-viewer](https://github.com/TexteaInc/json-viewer) | [![](https://img.shields.io/bundlephobia/min/@textea/json-viewer?color=red&label=)](https://bundlephobia.com/result?p=@textea/json-viewer) [![](https://img.shields.io/bundlephobia/minzip/@textea/json-viewer?color=red&label=gzip)](https://bundlephobia.com/result?p=@textea/json-viewer) | [![](https://badgen.net/bundlephobia/dependency-count/%40textea%2Fjson-viewer?color=red&label=&t=vvv12213)](https://bundlephobia.com/result?p=@textea/json-viewer) | [![GitHub last commit](https://img.shields.io/github/last-commit/TexteaInc/json-viewer?style=flat&label=)](https://github.com/TexteaInc/json-viewer/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/@textea/json-viewer.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/@textea/json-viewer) | ✅ | [demo](https://stackblitz.com/edit/textea-json-viewer-v3-b4wgxq) |
| [react-editable-json-tree](https://github.com/oxyno-zeta/react-editable-json-tree) | [![](https://img.shields.io/bundlephobia/min/react-editable-json-tree?color=red&label=)](https://bundlephobia.com/result?p=react-editable-json-tree) [![](https://img.shields.io/bundlephobia/minzip/react-editable-json-tree?color=red&label=gzip)](https://bundlephobia.com/result?p=react-editable-json-tree) | [![](https://badgen.net/bundlephobia/dependency-count/%40textea%2Fjson-viewer?color=red&label=&t=vvv12213)](https://bundlephobia.com/result?p=react-editable-json-tree) | [![GitHub last commit](https://img.shields.io/github/last-commit/oxyno-zeta/react-editable-json-tree?style=flat&label=)](https://github.com/oxyno-zeta/react-editable-json-tree/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/react-editable-json-tree.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/react-editable-json-tree) | ✅ | [demo](https://oxyno-zeta.github.io/react-editable-json-tree/) |
| [react-json-view](https://github.com/HuolalaTech/react-json-view) | [![](https://img.shields.io/bundlephobia/min/@huolala-tech/react-json-view?color=red&label=)](https://bundlephobia.com/result?p=@huolala-tech/react-json-view) [![](https://img.shields.io/bundlephobia/minzip/@huolala-tech/react-json-view?color=red&label=gzip)](https://bundlephobia.com/result?p=@huolala-tech/react-json-view) | [![](https://badgen.net/bundlephobia/dependency-count/%40textea%2Fjson-viewer?color=red&label=&t=vvv12213)](https://bundlephobia.com/result?p=@huolala-tech/react-json-view) | [![GitHub last commit](https://img.shields.io/github/last-commit/TexteaInc/json-viewer?style=flat&label=)](https://github.com/HuolalaTech/react-json-view/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/@huolala-tech/react-json-view.svg?style=flat&color=747474&label=)](https://www.npmjs.com/package/@huolala-tech/react-json-view) | ❌ | [demo](https://huolalatech.github.io/react-json-view/) |

## Development

Runs the project in development mode.

```bash
# Step 1, run first, listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch
# Step 2, development mode, listen to compile preview website instance
npm run start
```

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uiwjs/react-json-view/graphs/contributors">
  <img src="https://uiwjs.github.io/react-json-view/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
````

## File: core/triangle-arrow.d.ts
````typescript
declare module '@uiw/react-json-view/triangle-arrow' {
  import React from 'react';
  export interface TriangleArrowProps extends React.SVGProps<SVGSVGElement> { }
  export function TriangleArrow(props: TriangleArrowProps): import("react/jsx-runtime").JSX.Element;
}
````

## File: core/triangle-solid-arrow.d.ts
````typescript
declare module '@uiw/react-json-view/triangle-solid-arrow' {
  import React from 'react';
  export interface TriangleSolidArrowProps extends React.SVGProps<SVGSVGElement> { }
  export function TriangleSolidArrow(props: TriangleSolidArrowProps): import("react/jsx-runtime").JSX.Element;
}
````

## File: core/tsconfig.json
````json
{
  "extends": "../tsconfig",
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts"],
  "compilerOptions": {
    "outDir": "../cjs",
    "baseUrl": ".",
    "noEmit": false,
    "paths": {
      "*": ["*", "types/*"]
    }
  }
}
````

## File: core/vscode.d.ts
````typescript
declare module '@uiw/react-json-view/vscode' {
  export const vscodeTheme: import('react').CSSProperties;
}
````

## File: example/public/index.html
````html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <meta name="keywords" content="react,react-component,array-viewer,base-16,component,interactive,interactive-json,json,json-component,json-display,json-tree,json-view,json-viewer,json-inspector,json-tree,react,react-component,react-json,theme,tree,tree-view,treeview,jaywcjlove">
  <meta name="description" content="A React component for displaying and editing javascript arrays and JSON objects.">
  <!--<link rel="manifest" href="%PUBLIC_URL%/manifest.json">-->
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  <!--
    Notice the use of %PUBLIC_URL% in the tags above.
    It will be replaced with the URL of the `public` folder during the build.
    Only files inside the `public` folder can be referenced from the HTML.

    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
    work correctly both with client-side routing and a non-root public URL.
    Learn how to configure a non-root public URL by running `npm run build`.
  -->
	<title>react-json-view</title>
</head>

<body>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <div id="root"></div>
  <!--
    This HTML file is a template.
    If you open it directly in the browser, you will see an empty page.

    You can add webfonts, meta tags, or analytics to this file.
    The build step will place the bundled scripts into the <body> tag.

    To begin the development, run `npm start` or `yarn start`.
    To create a production bundle, use `npm run build` or `yarn build`.
  -->
</body>

</html>
````

## File: example/src/demo.tsx
````typescript
import JsonView from '@uiw/react-json-view';

const example = {
  nestedArray: [],
  object: {},
  data: {
    value: 1,
  },
};

export default function App() {
  return (
    <JsonView value={example}>
      <JsonView.KeyName
        as="span"
        render={({ style, onClick, ...props }, { keyName, keys }) => {
          console.log('~~:', keyName, keys); // keys undefined
          return <span {...props} style={{ ...style, backgroundColor: 'red' }} />;
        }}
      />
    </JsonView>
  );
}
````

## File: example/src/index.tsx
````typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Example from './demo';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Example />);
````

## File: example/.kktrc.ts
````typescript
import path from 'path';
import webpack from 'webpack';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import { mdCodeModulesLoader } from 'markdown-react-code-preview-loader';
import pkg from './package.json';

export default (conf: WebpackConfiguration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = rawModules(conf, env, { ...options });
  conf = mdCodeModulesLoader(conf);
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [path.resolve(process.cwd(), 'README.md')],
  });
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );

  conf.ignoreWarnings = [{ module: /node_modules[\\/]parse5[\\/]/ }];

  conf.module!.exprContextCritical = false;
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
    conf.optimization = {
      ...conf.optimization,
      splitChunks: {
        automaticNameDelimiter: '.',
        maxSize: 500000,
        minSize: 100000,
        cacheGroups: {
          reactvendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            reuseExistingChunk: true,
            chunks: 'all',
            priority: -10,
          },
          refractor: {
            test: /[\\/]node_modules[\\/](refractor)[\\/]/,
            name: 'refractor-prismjs-vendor',
            chunks: 'all',
          },
        },
      },
    };
  }
  return conf;
};
````

## File: example/package.json
````json
{
  "name": "example",
  "version": "2.0.0-alpha.33",
  "preview": true,
  "scripts": {
    "build": "kkt build",
    "start": "kkt start"
  },
  "dependencies": {
    "@uiw/react-json-view": "2.0.0-alpha.33",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "@kkt/raw-modules": "^7.5.1",
    "@kkt/scope-plugin-options": "^7.5.1",
    "@types/react": "^18.0.31",
    "@types/react-dom": "^18.0.11",
    "kkt": "^7.5.1",
    "markdown-react-code-preview-loader": "^2.1.2",
    "source-map-explorer": "^2.5.3"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
````

## File: example/README.md
````markdown
For testing purposes
````

## File: example/tsconfig.json
````json
{
  "extends": "../tsconfig",
  "include": ["src/*", ".kktrc.ts"],
  "compilerOptions": {
    "noEmit": false
  }
}
````

## File: www/public/index.html
````html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <meta name="keywords" content="react,react-component,array-viewer,base-16,component,interactive,interactive-json,json,json-component,json-display,json-tree,json-view,json-viewer,json-inspector,json-tree,react,react-component,react-json,theme,tree,tree-view,treeview,jaywcjlove">
  <meta name="description" content="A React component for displaying and editing javascript arrays and JSON objects.">
  <!--<link rel="manifest" href="%PUBLIC_URL%/manifest.json">-->
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  <!--
    Notice the use of %PUBLIC_URL% in the tags above.
    It will be replaced with the URL of the `public` folder during the build.
    Only files inside the `public` folder can be referenced from the HTML.

    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
    work correctly both with client-side routing and a non-root public URL.
    Learn how to configure a non-root public URL by running `npm run build`.
  -->
	<title>react-json-view</title>
</head>

<body>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <div id="root"></div>
  <!--
    This HTML file is a template.
    If you open it directly in the browser, you will see an empty page.

    You can add webfonts, meta tags, or analytics to this file.
    The build step will place the bundled scripts into the <body> tag.

    To begin the development, run `npm start` or `yarn start`.
    To create a production bundle, use `npm run build` or `yarn build`.
  -->
</body>

</html>
````

## File: www/src/example/default.tsx
````typescript
import { Fragment, useState, useReducer, useEffect } from 'react';
import JsonView, { JsonViewProps } from '@uiw/react-json-view';
import { styled } from 'styled-components';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { nordTheme } from '@uiw/react-json-view/nord';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { basicTheme } from '@uiw/react-json-view/basic';

export const themesData = {
  nord: nordTheme,
  light: lightTheme,
  dark: darkTheme,
  basic: basicTheme,
  vscode: vscodeTheme,
  githubLight: githubLightTheme,
  githubDark: githubDarkTheme,
  gruvbox: gruvboxTheme,
  monokai: monokaiTheme,
};
const mySet = new Set();
mySet.add(1); // Set(1) { 1 }
mySet.add(5); // Set(2) { 1, 5 }
mySet.add(5); // Set(2) { 1, 5 }
mySet.add('some text'); // Set(3) { 1, 5, 'some text' }

const myMap = new Map();
myMap.set('www', 'foo');
myMap.set(1, 'bar');

const avatar = 'https://i.imgur.com/1bX5QH6.jpg';
// const longArray = new Array(1000).fill(1);
function aPlusB(a: number, b: number) {
  return a + b;
}
export const example = {
  avatar,
  string: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
  integer: 42,
  float: 114.514,
  bigint: BigInt(10086),
  nan: NaN,
  null: null,
  undefined,
  boolean: true,
  timer: 0,
  date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
  array: [19, 100.86, 'test', NaN, Infinity],
  emptyArray: [],
  nestedArray: [[1, 2], [3, 4], { a: 1 }],
  object3: {},
  object2: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  url: new URL('https://wangchujiang.com/'),
  fn: aPlusB,
  // // longArray,
  string_number: '1234',
  string_empty: '',
  mySet,
  myMap,
};

const Label = styled.label`
  margin-top: 0.83rem;
  display: block;
  span {
    padding-right: 6px;
  }
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: 50% 60%;
`;

const initialState: Partial<
  JsonViewProps<object> & {
    quote: string;
    theme: keyof typeof themesData;
  }
> = {
  displayObjectSize: true,
  displayDataTypes: true,
  enableClipboard: true,
  highlightUpdates: true,
  objectSortKeys: false,
  indentWidth: 15,
  collapsed: 2,
  quote: '"',
  shortenTextAfterLength: 50,
  theme: 'nord',
};

const reducer = (state: typeof initialState, action: typeof initialState) => ({ ...state, ...action });

export function Example() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [src, setSrc] = useState({ ...example });
  const themeKeys = Object.keys(themesData) as Array<keyof typeof themesData>;

  useEffect(() => {
    const loop = () => {
      setSrc((src) => ({
        ...src,
        timer: src.timer + 1,
      }));
    };
    const id = setInterval(loop, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Fragment>
      <JsonView
        value={src}
        style={{ ...themesData[state.theme!], padding: 6, borderRadius: 6 }}
        displayObjectSize={state.displayObjectSize}
        displayDataTypes={state.displayDataTypes}
        enableClipboard={state.enableClipboard}
        highlightUpdates={state.highlightUpdates}
        indentWidth={state.indentWidth}
        shortenTextAfterLength={state.shortenTextAfterLength}
        collapsed={state.collapsed}
        objectSortKeys={state.objectSortKeys}
      >
        <JsonView.KeyName
          render={(props, { value, keyName }) => {
            if (keyName === 'integer' && typeof value === 'number' && value > 10) {
              return <del {...props}>{keyName}</del>;
            }
          }}
        />
        <JsonView.Quote>{state.quote}</JsonView.Quote>
        <JsonView.ValueQuote
          render={(props) => {
            if (!state.quote?.trim()) return <span />;
            return <span {...props}>{state.quote}</span>;
          }}
        />
      </JsonView>
      <Options>
        <Label>
          <span>Theme:</span>
          <select onChange={(evn) => dispatch({ theme: evn.target.value as keyof typeof themesData })}>
            {themeKeys.map((key) => (
              <option value={key} key={key}>
                {key}
              </option>
            ))}
          </select>
        </Label>
        <Label>
          <span>Collapsed:</span>
          <select
            value={state.collapsed?.toString()}
            onChange={({ target: { value } }) => {
              const val = value === 'false' ? false : value === 'true' ? true : Number(value);
              dispatch({ collapsed: val });
            }}
          >
            <option value="false">false</option>
            <option value="true">true</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Label>
        <Label>
          <span>Indent:</span>
          <input
            type="number"
            value={state.indentWidth}
            onChange={(evn) =>
              dispatch({
                indentWidth: Number(evn.target.value),
              })
            }
          />
        </Label>
        <Label>
          <span>Quotes:</span>
          <select
            value={state.quote}
            onChange={(evn) =>
              dispatch({
                quote: evn.target.value,
              })
            }
          >
            <option value=" ">enable quotes</option>
            <option value={`"`}>" double quotes</option>
            <option value={`'`}>' single quotes</option>
          </select>
        </Label>
        <Label>
          <span>Enable Clipboard:</span>
          <input
            type="checkbox"
            checked={state.enableClipboard}
            onChange={(evn) =>
              dispatch({
                enableClipboard: evn.target.checked,
              })
            }
          />
        </Label>
        <Label>
          <span>Display Data Types:</span>
          <input
            type="checkbox"
            checked={state.displayDataTypes}
            onChange={(evn) =>
              dispatch({
                displayDataTypes: evn.target.checked,
              })
            }
          />
        </Label>
        <Label>
          <span>Display Object Size:</span>
          <input
            type="checkbox"
            checked={state.displayObjectSize}
            onChange={(evn) =>
              dispatch({
                displayObjectSize: evn.target.checked,
              })
            }
          />
        </Label>
        <Label>
          <span>Display Highlight Updates:</span>
          <input
            type="checkbox"
            checked={state.highlightUpdates}
            onChange={(evn) =>
              dispatch({
                highlightUpdates: evn.target.checked,
              })
            }
          />
        </Label>
        <Label>
          <span>Sort Keys Through:</span>
          <input
            type="checkbox"
            checked={state.objectSortKeys as boolean}
            onChange={(evn) =>
              dispatch({
                objectSortKeys: evn.target.checked,
              })
            }
          />
        </Label>
        <Label>
          <div>Shorten Text After Length({state.shortenTextAfterLength})</div>
          <input
            type="range"
            value={state.shortenTextAfterLength}
            onChange={(evn) =>
              dispatch({
                shortenTextAfterLength: Number(evn.target.value),
              })
            }
          />
        </Label>
      </Options>
    </Fragment>
  );
}
````

## File: www/src/example/editor.tsx
````typescript
import React, { useReducer } from 'react';
// import { styled } from 'styled-components';
import JsonViewEditor, { JsonViewEditorProps } from '@uiw/react-json-view/editor';
import { themesData } from './default';

export const example = {
  string: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
  // integer: 42,
  // float: 114.514,
  // bigint: BigInt(10086),
  // nan: NaN,
  // null: null,
  // undefined,
  // boolean: true,
  // timer: 0,
  array: [19, 100.86, 'test', NaN, Infinity],
  object2: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
};
const initialState: Partial<
  JsonViewEditorProps<object> & {
    quote: string;
    theme: keyof typeof themesData;
  }
> = {
  displayObjectSize: true,
  displayDataTypes: true,
  enableClipboard: true,
  highlightUpdates: true,
  objectSortKeys: false,
  indentWidth: 15,
  collapsed: 2,
  quote: '"',
  shortenTextAfterLength: 50,
  theme: 'nord',
};

const reducer = (state: typeof initialState, action: typeof initialState) => ({ ...state, ...action });
export default function Demo() {
  const [state] = useReducer(reducer, initialState);
  return (
    <JsonViewEditor
      value={example}
      keyName="root"
      onEdit={({ value }) => {
        console.log(':value:', value);
      }}
      style={{ ...themesData[state.theme!], padding: 6, borderRadius: 6 }}
    />
  );
}
````

## File: www/src/App.tsx
````typescript
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Example } from './example/default';

const ExampleWrapper = styled.div`
  max-width: 630px;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

const TabItem = styled.div`
  padding-bottom: 10px;
`;

const Button = styled.button<{ $active: boolean }>`
  background: transparent;
  border: 0;
  cursor: pointer;
  border-radius: 3px;
  ${({ $active }) =>
    $active &&
    css`
      background-color: var(--color-theme-text, #bce0ff);
      color: var(--color-theme-bg);
    `}
`;

export default function App() {
  const [tabs, setTabs] = useState<'preview' | 'editor'>('preview');
  return (
    <ExampleWrapper>
      <TabItem>
        <Button $active={tabs === 'preview'} onClick={() => setTabs('preview')}>
          Preview
        </Button>
        {/* <Button $active={tabs === 'editor'} onClick={() => setTabs('editor')}>
          Editor
        </Button> */}
      </TabItem>
      {tabs === 'preview' && <Example />}
      {/* {tabs === 'editor' && <ExampleEditor />} */}
    </ExampleWrapper>
  );
}
````

## File: www/src/index.tsx
````typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import data from '@uiw/react-json-view/README.md';
import MarkdownPreviewExample from '@uiw/react-markdown-preview-example';
import App from './App';

export const GlobalStyle = createGlobalStyle`
  [data-color-mode*='dark'], [data-color-mode*='dark'] body {
    --tabs-bg: #5f5f5f;
  }
  [data-color-mode*='light'], [data-color-mode*='light'] body {
    background-color: #f2f2f2;
    --tabs-bg: #bce0ff;
  }
  * {
    box-sizing: border-box;
  }
  .w-rjv {
    padding: 0.4rem;
    border-radius: 0.2rem;
  }
`;

const Github = MarkdownPreviewExample.Github;
const Example = MarkdownPreviewExample.Example;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <MarkdownPreviewExample
    source={data.source}
    components={data.components}
    data={data.data}
    title="JSON View for React"
    description="A React component for displaying and editing javascript arrays and JSON objects."
    version={`v${VERSION}`}
  >
    <MarkdownPreviewExample.NavMenu
      title="JSON View"
      menus={[
        <a target="_blank" href="https://jaywcjlove.github.io/#/sponsor" rel="noopener noreferrer">
          Sponsor
        </a>,
      ]}
    />
    <Github href="https://github.com/uiwjs/react-json-view" />
    <Example>
      <App />
    </Example>
  </MarkdownPreviewExample>,
);
````

## File: www/src/react-app-env.d.ts
````typescript
/// <reference types="react-scripts" />

declare var VERSION: string;

declare module '*.md' {
  import { CodeBlockData } from 'markdown-react-code-preview-loader';
  const src: CodeBlockData;
  export default src;
}
````

## File: www/.kktrc.ts
````typescript
import path from 'path';
import webpack from 'webpack';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import { mdCodeModulesLoader } from 'markdown-react-code-preview-loader';
import pkg from './package.json';

export default (conf: WebpackConfiguration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = rawModules(conf, env, { ...options });
  conf = mdCodeModulesLoader(conf);
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [path.resolve(process.cwd(), 'README.md')],
  });
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );

  conf.ignoreWarnings = [{ module: /node_modules[\\/]parse5[\\/]/ }];

  conf.module!.exprContextCritical = false;
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
    conf.optimization = {
      ...conf.optimization,
      splitChunks: {
        automaticNameDelimiter: '.',
        maxSize: 500000,
        minSize: 100000,
        cacheGroups: {
          reactvendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            reuseExistingChunk: true,
            chunks: 'all',
            priority: -10,
          },
          refractor: {
            test: /[\\/]node_modules[\\/](refractor)[\\/]/,
            name: 'refractor-prismjs-vendor',
            chunks: 'all',
          },
        },
      },
    };
  }
  return conf;
};
````

## File: www/package.json
````json
{
  "name": "website",
  "version": "2.0.0-alpha.33",
  "preview": true,
  "scripts": {
    "build": "kkt build",
    "start": "kkt start",
    "map": "source-map-explorer build/static/js/*.js --html build/website-result.html"
  },
  "dependencies": {
    "@uiw/react-color-colorful": "^2.0.0",
    "@uiw/react-json-view": "2.0.0-alpha.33",
    "@uiw/react-markdown-preview-example": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "@kkt/raw-modules": "^7.5.1",
    "@kkt/scope-plugin-options": "^7.5.1",
    "@types/react": "^18.0.31",
    "@types/react-dom": "^18.0.11",
    "kkt": "^7.5.1",
    "markdown-react-code-preview-loader": "^2.1.2",
    "source-map-explorer": "^2.5.3"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
````

## File: www/tsconfig.json
````json
{
  "extends": "../tsconfig",
  "include": ["src/*", ".kktrc.ts"],
  "compilerOptions": {
    "noEmit": false
  }
}
````

## File: .gitignore
````
coverage
cjs
esm
build
node_modules
npm-debug.log*
package-lock.json
__snapshots__

.eslintcache
.DS_Store
.cache
.vscode

*.bak
*.tem
*.temp
#.swp
*.*~
~*.*
````

## File: .lintstagedrc
````
{
  "*.{js,jsx,tsx,ts,less,md,json}": [
    "prettier --write"
  ]
}
````

## File: .prettierignore
````
**/*.md
**/*.svg
**/*.ejs
**/*.yml
package.json
node_modules
dist
build
lib
cjs
esm
test
````

## File: .prettierrc
````
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    },
    {
      "files": "*.{js,jsx}",
      "options": { "parser": "babel" }
    },
    {
      "files": "*.{ts,tsx}",
      "options": { "parser": "babel-ts" }
    },
    {
      "files": "*.{ts,tsx}",
      "options": { "parser": "typescript" }
    },
    {
      "files": "*.{less,css}",
      "options": { "parser": "css" }
    }
  ]
}
````

## File: lerna.json
````json
{
  "version": "2.0.0-alpha.33",
  "packages": ["core", "www", "example"]
}
````

## File: LICENSE
````
MIT License

Copyright (c) 2023 uiwjs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "private": true,
  "scripts": {
    "watch": "lerna exec --scope @uiw/react-json-view -- tsbb watch \"src/*.{ts,tsx}\" --use-babel --cjs cjs",
    "build": "lerna exec --scope @uiw/react-json-view -- tsbb build \"src/*.{ts,tsx}\" --use-babel --cjs cjs",
    "start": "lerna exec --scope website -- npm run start",
    "doc": "lerna exec --scope website -- npm run build",
    "type-check": "lerna exec \"tsc --noEmit\" --scope @uiw/* --stream",
    "test": "lerna exec --scope @uiw/react-json-view -- tsbb test --env=jsdom",
    "coverage": "lerna exec --scope @uiw/react-json-view -- tsbb test --env=jsdom --coverage --bail",
    "prepare": "husky",
    "publish": "lerna publish from-package --yes --no-verify-access",
    "version": "lerna version --exact --force-publish --no-push --no-git-tag-version",
    "prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
    "remove": "npm run clean && lerna exec \"rm -rf package-lock.json\" --scope @uiw/react-json-view --scope website",
    "clean": "lerna clean --yes"
  },
  "license": "MIT",
  "workspaces": [
    "core",
    "example",
    "www"
  ],
  "engines": {
    "node": ">=16.0.0"
  },
  "overrides": {
    "typescript": "^5.1.3"
  },
  "devDependencies": {
    "husky": "^9.0.11",
    "lint-staged": "^15.0.0",
    "lerna": "^8.0.0",
    "prettier": "^3.0.0",
    "tsbb": "^4.5.5"
  }
}
````

## File: renovate.json
````json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["*"],
      "rangeStrategy": "replace"
    }
  ]
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "baseUrl": ".",
    "jsx": "react-jsx",
    "noFallthroughCasesInSwitch": true,
    "noEmit": true
  }
}
````
