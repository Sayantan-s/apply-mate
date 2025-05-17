import { GoogleGenAI } from "@google/genai";

/* eslint-disable @typescript-eslint/no-extraneous-class */
class Gemini {
  public static FLASH_V2 = "gemini-2.0-flash";
  public static FLASH_V25 = "gemini-2.5-flash-preview-04-17";
}

class Model {
  public static gemini = Gemini;
}

interface LLMChoiceStrategy<TLLMType> {
  init(config: ILLMConfig): TLLMType;
}

interface ILLMConfig {
  apiKey: string;
}

export class GEMINI implements LLMChoiceStrategy<unknown> {
  init(config: ILLMConfig) {
    const ai = new GoogleGenAI(config);
    return ai;
  }
}

export class LLM<TLLMType> {
  public static model = Model;
  private strategy: LLMChoiceStrategy<TLLMType>;
  private config: ILLMConfig;

  constructor(strategy: LLMChoiceStrategy<TLLMType>, config: ILLMConfig) {
    this.strategy = strategy;
    this.config = config;
  }

  init() {
    return this.strategy.init(this.config);
  }
}
