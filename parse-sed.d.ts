/**
 * TypeScript definition for parse-sed
 */

declare namespace parseSed {

  /**
   * A single sed instruction
   */
  export interface Instruction {
    addr1: number | undefined;
    addr2: number | undefined;
    positive: boolean;
    verb: string;
    arg?: Array<string|undefined>;
    delimiter?: string;
    string1?: string;
    re?: RegExp|null;
    replacement?: string;
    flags?: string;
    nth?: number;
  }

  export interface Expression {
    commands: parseSed.Instruction[];
    label: {
      [label: string]: number;
    }
  }
}

declare function parseSed (instruction: string) : parseSed.Expression;

export = parseSed;
