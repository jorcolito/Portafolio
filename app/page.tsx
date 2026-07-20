import { JorgeExeExperience } from "./JorgeExeExperience";
import { LocaleProvider } from "@/src/i18n/LocaleContext";

export default function Home() {
  return (
    <LocaleProvider>
      <JorgeExeExperience />
    </LocaleProvider>
  );
}
