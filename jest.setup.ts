// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
