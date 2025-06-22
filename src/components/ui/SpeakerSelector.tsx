import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Upload, X } from "lucide-react";
import { getSpeakers, addSpeaker } from "../../services/speakerService.ts";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import TextField from "./TextField";

interface SpeakerSelectorProps {
  selectedSpeaker: string | null;
  onSpeakerChange: (speaker: string | null) => void;
  className?: string;
}

const SpeakerSelector: React.FC<SpeakerSelectorProps> = ({
  selectedSpeaker,
  onSpeakerChange,
  className = "",
}) => {
  const { t } = useTranslation();
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddSpeaker, setShowAddSpeaker] = useState(false);
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    try {
      setIsLoading(true);
      const speakerList = await getSpeakers();
      setSpeakers(speakerList);
    } catch (error) {
      console.error("Failed to load speakers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakerSelect = (speaker: string) => {
    onSpeakerChange(speaker === selectedSpeaker ? null : speaker);
    setIsOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddSpeaker = async () => {
    if (!newSpeakerName.trim() || !selectedFile) return;

    try {
      setIsUploading(true);
      await addSpeaker(selectedFile, newSpeakerName.trim());
      await loadSpeakers();
      setNewSpeakerName("");
      setSelectedFile(null);
      setShowAddSpeaker(false);
    } catch (error) {
      console.error("Failed to add speaker:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetAddSpeaker = () => {
    setShowAddSpeaker(false);
    setNewSpeakerName("");
    setSelectedFile(null);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1E1E1E] text-[#F5F5F5] rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
        disabled={isLoading}
      >
        <span className="text-sm text-[#CCCCCC]">
          {selectedSpeaker || t("translation.selectVoice")}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-[#1E1E1E] rounded-lg border border-[#333] shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-hidden w-max">
          <div className="border-b border-[#333] mt-2 py-2 px-2">
            <button
              onClick={() => setShowAddSpeaker(true)}
              className="px-3 py-2 rounded text-sm text-[#BB86FC] hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              {t("translation.addNewVoice")}
            </button>
          </div>
          <div className="p-2 flex flex-col gap-2">
            <button
              onClick={() => handleSpeakerSelect("")}
              className={`px-3 py-2 rounded text-sm hover:bg-[#2A2A2A] transition-colors ${
                !selectedSpeaker
                  ? "bg-[#BB86FC] bg-opacity-20 text-[#BB86FC]"
                  : "text-[#F5F5F5]"
              }`}
            >
              {t("translation.defaultVoice")}
            </button>

            {speakers.map((speaker) => (
              <button
                key={speaker}
                onClick={() => handleSpeakerSelect(speaker)}
                className={`px-3 py-2 rounded text-sm hover:bg-[#2A2A2A] transition-colors ${
                  selectedSpeaker === speaker
                    ? "bg-[#BB86FC] bg-opacity-20 text-[#BB86FC]"
                    : "text-[#F5F5F5]"
                }`}
              >
                {speaker}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddSpeaker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#F5F5F5]">
                {t("translation.addNewVoice")}
              </h3>
              <button
                onClick={resetAddSpeaker}
                className="text-[#757575] hover:text-[#F5F5F5] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <TextField
                label={t("translation.voiceName")}
                value={newSpeakerName}
                onChange={(e) => setNewSpeakerName(e.target.value)}
                placeholder={t("translation.enterVoiceName")}
                fullWidth
              />

              <div>
                <label className="block text-[#CCCCCC] mb-2 text-sm">
                  {t("translation.audioFile")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/wav,audio/mpeg,audio/mp3,audio/ogg"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="speaker-file-input"
                  />
                  <label
                    htmlFor="speaker-file-input"
                    className="w-full bg-[#2A2A2A] border-2 border-dashed border-[#757575] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#BB86FC] transition-colors"
                  >
                    <Upload size={24} className="text-[#757575] mb-2" />
                    <span className="text-sm text-[#757575]">
                      {selectedFile
                        ? selectedFile.name
                        : t("translation.selectAudioFile")}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={resetAddSpeaker}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddSpeaker}
                  className="flex-1"
                  disabled={
                    !newSpeakerName.trim() || !selectedFile || isUploading
                  }
                >
                  {isUploading ? t("common.loading") : t("common.save")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerSelector;
