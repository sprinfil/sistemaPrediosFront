import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Save } from "lucide-react";


type QuestionType = "abierta" | "multiple";

interface Option {
  id: string;
  text: string;
  value?: string;
  imageUrl?: string;
  order: number;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  required: boolean;
  options: Option[];
}

interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  active: boolean;
  questions: Question[];
}

export default function DatosConfiguradorCensos() {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    id: `q_${Date.now()}`,
    title: "",
    active: true,
    questions: []
  });
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [showQuestionTypeDialog, setShowQuestionTypeDialog] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>("abierta");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [tempOptions, setTempOptions] = useState<Option[]>([{ id: `opt_${Date.now()}`, text: "", order: 1 }]);

  const handleSave = () => {
    console.log("Saving questionnaire:", questionnaire);
    alert("Cuestionario guardado correctamente");
  };

  const handleNameConfirm = () => {
    if (questionnaire.title.trim() === "") {
      alert("Por favor, ingresa un nombre para el cuestionario");
      return;
    }
    setNameConfirmed(true);
  };

  const handleCancel = () => {
    if (confirm("¿Estás seguro de que deseas cancelar la creación del censo?")) {
      setQuestionnaire({
        id: `q_${Date.now()}`,
        title: "",
        active: true,
        questions: []
      });
      setNameConfirmed(false);
    }
  };

  const handleAddQuestion = () => {
    setNewQuestionText("");
    setTempOptions([{ id: `opt_${Date.now()}`, text: "", order: 1 }]);
    setShowQuestionTypeDialog(true);
  };

  const handleAddQuestionConfirm = () => {
    if (newQuestionText.trim() === "") {
      alert("Por favor, ingresa el texto de la pregunta");
      return;
    }

    if (newQuestionType === "multiple") {
      const validOptions = tempOptions.filter(opt => opt.text.trim() !== "");
      if (validOptions.length < 2) {
        alert("Las preguntas de opción múltiple requieren al menos 2 opciones válidas");
        return;
      }
      const cleanedOptions = tempOptions.filter(opt => opt.text.trim() !== "");
      const newQuestion: Question = {
        id: `q_${Date.now()}`,
        text: newQuestionText,
        type: newQuestionType,
        order: questionnaire.questions.length + 1,
        required: false,
        options: cleanedOptions.map((opt, index) => ({
          ...opt,
          order: index + 1
        }))
      };
      
      setQuestionnaire(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    } else {
      const newQuestion: Question = {
        id: `q_${Date.now()}`,
        text: newQuestionText,
        type: "abierta",
        order: questionnaire.questions.length + 1,
        required: false,
        options: []
      };
      
      setQuestionnaire(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }
    
    setShowQuestionTypeDialog(false);
  };
  const handleAddOption = () => {
    setTempOptions(prev => [
      ...prev,
      { id: `opt_${Date.now()}`, text: "", order: prev.length + 1 }
    ]);
  };
  const handleRemoveOption = (optionId: string) => {
    if (tempOptions.length <= 1) {
      alert("Debes tener al menos una opción");
      return;
    }
    
    setTempOptions(prev => 
      prev.filter(opt => opt.id !== optionId)
        .map((opt, index) => ({ ...opt, order: index + 1 }))
    );
  };
  const handleOptionTextChange = (optionId: string, text: string) => {
    setTempOptions(prev => 
      prev.map(opt => opt.id === optionId ? { ...opt, text } : opt)
    );
  };
  const handleRemoveQuestion = (questionId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
      setQuestionnaire(prev => ({
        ...prev,
        questions: prev.questions
          .filter(q => q.id !== questionId)
          .map((q, index) => ({ ...q, order: index + 1 }))
      }));
    }
  };
    //max-w-4xl
  return (
    <div className="container w-full p-4 "> 
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nombre del cuestionario</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={questionnaire.title}
            onChange={(e) => setQuestionnaire(prev => ({ ...prev, title: e.target.value }))}
            disabled={nameConfirmed}
            placeholder="Escribe el nombre del censo"
          />
        </CardContent>
        {!nameConfirmed && (
          <CardFooter>
            <Button onClick={handleNameConfirm}>Confirmar</Button>
          </CardFooter>
        )}
      </Card>

      {nameConfirmed && (
        <>
          {questionnaire.questions.map((question, index) => (
            <Card key={question.id} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pregunta {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveQuestion(question.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium mb-2">{question.text}</p>
                  <div className="text-sm text-muted-foreground">
                    Tipo: {question.type === "abierta" ? "Pregunta abierta" : "Opción múltiple"}
                  </div>
                </div>

                {question.type === "multiple" && question.options.length > 0 && (
                  <div className="ml-4">
                    <p className="text-sm font-medium mb-2">Opciones:</p>
                    <ul className="list-disc ml-4">
                      {question.options.map((option) => (
                        <li key={option.id}>{option.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end mb-4">
            <Button onClick={handleAddQuestion}>
              <Plus className="mr-2 h-4 w-4" /> Añadir pregunta
            </Button>
          </div>
        </>
      )}
      <Dialog open={showQuestionTypeDialog} onOpenChange={setShowQuestionTypeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tipo de pregunta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup value={newQuestionType} onValueChange={(value) => setNewQuestionType(value as QuestionType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="abierta" id="abierta" />
                <Label htmlFor="abierta">Pregunta abierta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">Opción múltiple</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="question-text">Texto de la pregunta</Label>
              <Textarea 
                id="question-text" 
                value={newQuestionText} 
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Escribe la pregunta"
              />
            </div>

            {newQuestionType === "multiple" && (
              <div className="space-y-4">
                <Label>Opciones</Label>
                {tempOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Input
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={tempOptions.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddOption}>
                  <Plus className="mr-2 h-4 w-4" /> Añadir opción
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowQuestionTypeDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddQuestionConfirm}>
              Añadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}