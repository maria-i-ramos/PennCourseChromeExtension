import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { AutoComplete, Input, Checkbox } from 'antd';
// @ts-ignore
import pennCourseSearchImage from './assets/pennCourseSearch.png';
// @ts-ignore
import copy from './assets/copy.png';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Instructor {
  id: number,
  name: string
}

interface Section {
  instructors: Instructor[];
  course_quality: number,
  instructor_quality: number,
  difficulty: number,
  work_required: number
}

// Define a course selection interface
interface CourseSelection {
  id: string,
  title: string,
  isChecked: boolean,
  timestamp: number, // For sorting by recency
  courseData?: any, // Store the full course data for quick access
  note?: string
}

function App() {
  const [courseInput, setCourseInput] = useState('');
  const [courseResult, setCourseResult] = useState({
    id: '',
    title: '',
    description: 'No Course Found',
    prerequisites: '',
    course_quality: 0,
    instructor_quality: 0,
    difficulty: 0,
    work_required: 0,
    credits: 0,
    instructor: ''
  });

  const [courseResultProfessors, setCourseResultProfessors] = useState([{
    id: '',
    title: '',
    description: 'No Course Found',
    prerequisites: '',
    course_quality: 0,
    instructor_quality: 0,
    difficulty: 0,
    work_required: 0,
    credits: 0,
    instructor: ''
  }]);

  // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Get the initial search history from storage
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // New states for checkbox feature
  const [currentSelections, setCurrentSelections] = useState<CourseSelection[]>([]);
  const [previousSelections, setPreviousSelections] = useState<CourseSelection[]>([]);
  const [showCurrentSelections, setShowCurrentSelections] = useState(true);
  const [showPreviousSelections, setShowPreviousSelections] = useState(false);

  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [courses, setCourses] = useState<{ title: string, desc: string[], url: string }[]>([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300; // desired maximum length

  // New states for AI course selection
  const [apiKey, setApiKey] = useState<string>('');
  const [aiSelection, setAiSelection] = useState<string>('');
  const [singleCourseAnalysis, setSingleCourseAnalysis] = useState<string>('');
  const [multiCourseRecommendation, setMultiCourseRecommendation] = useState<string>('');

  // New states for AI course summary
  // const [aiSummary, setAiSummary] = useState<string>('');

  useEffect(() => {
    // Load search history and selections key from chrome storage
    chrome.storage.local.get(['searchHistory', 'previousSelections', 'openaiKey'], (result) => {
      if (result.searchHistory) {
        setSearchHistory(result.searchHistory);
      }
      
      if (result.previousSelections) {
        setPreviousSelections(result.previousSelections);
      }

      if (result.openaiKey) {
        setApiKey(result.openaiKey);
      }
    });
  }, []);

  // handler to save key
  const saveKey = () => {
    chrome.storage.local.set({ openaiKey: apiKey });
  };

  // Quick course recommendation (original functionality)
  const askForSelection = () => {
    // Get checked courses from both sections
    const checkedCurrent = currentSelections.filter(c => c.isChecked);
    const checkedPrevious = previousSelections.filter(c => c.isChecked);
    const allChecked = [...checkedCurrent, ...checkedPrevious];
    
    // Validate that at least one course is selected
    if (allChecked.length === 0) {
      setAiSelection("Please select at least one course to get a recommendation.");
      return;
    }
    
    // Send the courses to GPT
    chrome.runtime.sendMessage({
      action: 'getAiSelection',
      courses: allChecked
    }, (response) => {
      if (response?.answer) setAiSelection(response.answer);
    });
  };

  // Get a single course summary from GPT
  const askForCourseSummary = () => {
    // Get checked courses from both current and previous selections
    const checkedCurrent = currentSelections.filter(c => c.isChecked);
    const checkedPrevious = previousSelections.filter(c => c.isChecked);
    const allChecked = [...checkedCurrent, ...checkedPrevious];
    
    // Validate that exactly one course is selected
    if (allChecked.length !== 1) {
      setSingleCourseAnalysis("Please select exactly one course from either section.");
      return;
    }
    
    // Send the course to GPT
    chrome.runtime.sendMessage({
      action: 'getCourseSummary',
      course: allChecked[0]
    }, (response) => {
      if (response?.answer) setSingleCourseAnalysis(response.answer);
    });
  };

  // Compare multiple courses and get a recommendation
  const askForCourseRecommendation = () => {
    // Get checked courses from both current and previous selections
    const checkedCurrent = currentSelections.filter(c => c.isChecked);
    const checkedPrevious = previousSelections.filter(c => c.isChecked);
    
    // Combine and filter out duplicates based on course ID
    const allChecked = [...checkedCurrent, ...checkedPrevious];
    const uniqueIds = new Set();
    const uniqueCourses = allChecked.filter(course => {
      if (uniqueIds.has(course.id)) {
        return false; // Skip this course as it's a duplicate
      }
      uniqueIds.add(course.id);
      return true;
    });
    
    // Validate that at least two unique courses are selected
    if (uniqueCourses.length < 2) {
      setMultiCourseRecommendation("Please select at least two different courses to compare.");
      return;
    }
    
    // Send the unique courses to GPT
    chrome.runtime.sendMessage({
      action: 'getCourseRecommendation',
      courses: uniqueCourses
    }, (response) => {
      if (response?.answer) setMultiCourseRecommendation(response.answer);
    });
  };

  // Commented out for potential future use
  /*
  const askForSummary = () => {
    const checkedCourses = currentSelections.filter(c => c.isChecked).concat(previousSelections.filter(c => c.isChecked))
  
    if (checkedCourses.length === 0) return; 

    const toSend = checkedCourses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.courseData?.description || ''
    }));

    chrome.runtime.sendMessage({
      action: 'getCourseOutcomes',
      courses: toSend
    }, response => {
      if (response?.outcomes) setAiSummary(response.outcomes);
      else setAiSummary('No summary returned.');
    });
  };
  */

  const clearSearchHistory = () => {
    chrome.storage.local.remove('searchHistory', () => {
      console.log('Search history cleared');
    });
    setSearchHistory([]);
  };

  const clearAllSelections = () => {
    // Clear current selections
    setCurrentSelections([]);
    
    // Clear previous selections from storage
    chrome.storage.local.remove('previousSelections', () => {
      console.log('Previous selections cleared');
    });
    setPreviousSelections([]);
  };

  const updateNote = (courseId: string, newNote: string, type: 'current' | 'previous') => {
    if (type === 'current') {
      setCurrentSelections(prev => prev.map(selection =>
        selection.id === courseId ? { ...selection, note: newNote } : selection
      ));
    } else {
      const updated = previousSelections.map(selection =>
        selection.id === courseId ? { ...selection, note: newNote } : selection
      );
      setPreviousSelections(updated);
      chrome.storage.local.set({ previousSelections: updated });
    }
  };

  const rootURL = 'https://penncoursereview.com/api/base/current/courses';
  const altURL = 'https://penncoursereview.com/api/base/2024A/courses';

  const getData = async (url: string, course: string) => {
    const response = await axios.get(`${url}/${course}`);
    return response.data;
  }

  const parseData = async (data: any, changed: boolean) => {
    if (data.sections) { // to avoid no flatMap error
      // Parse instructor names from sections
      let instructors = data.sections.flatMap((section: Section) =>
        section.instructors.map((instructor: Instructor) => instructor.name)
      );
      instructors = instructors.filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);

      let professorsStats = data.sections.flatMap((section: Section) =>
        section.instructors.map((instructor: Instructor) => ({
          id: instructor.id,
          name: instructor.name,
          course_quality: section.course_quality ?? 0,
          instructor_quality: section.instructor_quality ?? 0,
          difficulty: section.difficulty ?? 0,
          work_required: section.work_required ?? 0
        })));

      // filter out the nulls, only keep the ones where the id is not null
      professorsStats = professorsStats.filter((prof: any) => prof.id !== null);

      // for repeated instructors, group them
      const groupedInstructors = professorsStats.reduce((acc: any, curr: any) => {
        acc[curr.id] = acc[curr.id] || [];
        acc[curr.id].push(curr);
        return acc;
      }, {});

      // for the repeated instructors, keep the statistics with highest instructor_quality
      const filteredInstructors = Object.values(groupedInstructors as Record<string, any[]>).map((instructors: any[]) => {
        return instructors.reduce((max: any, curr: any) => max.instructor_quality > curr.instructor_quality ? max : curr);
      });

      // Check if description contains "<b>" or "<p>" and remove that and all text after it
      let description = data.description;
      if (description.includes('<b>')) {
        description = description.split('<b>')[0];
      }
      if (description.includes('<p>')) {
        description = description.split('<p>')[0];
      }

      // If course was fetched from previous semester prepend warning to description
      if (changed) {
        description = ' This course is not available in the current semester. ' + description;
      }

      const courseOverallDefault = {
        id: data.id,
        title: data.title,
        description: description,
        prerequisites: data.prerequisites,
        course_quality: data.course_quality !== null ? data.course_quality : 0,
        instructor_quality: data.instructor_quality !== null ? data.instructor_quality : 0,
        difficulty: data.difficulty !== null ? data.difficulty : 0,
        work_required: data.work_required !== null ? data.work_required : 0,
        credits: data.credits,
        instructor: 'Past Instructors Overall Average'
      }

      const professorWithStatsAndOverall = filteredInstructors.map(instructor => ({
        id: data.id,
        title: data.title,
        description: description,
        prerequisites: data.prerequisites,
        course_quality: instructor.course_quality,
        instructor_quality: instructor.instructor_quality,
        difficulty: instructor.difficulty,
        work_required: instructor.work_required,
        credits: data.credits,
        instructor: instructor.name
      }));

      professorWithStatsAndOverall.unshift(courseOverallDefault);
      setCourseResultProfessors(professorWithStatsAndOverall);
      setCourseResult(courseOverallDefault);

      // Update the search history
      const newSearchHistory = [courseInput, ...searchHistory.filter(item => item !== courseInput)];
      setSearchHistory(newSearchHistory);
      chrome.storage.local.set({ searchHistory: newSearchHistory });

      // Add to current selections if not already present
      const newCourseSelection = {
        id: data.id,
        title: data.title,
        isChecked: false,
        timestamp: Date.now(),
        courseData: courseOverallDefault
      };

      // Check if course already exists in current selections
      if (!currentSelections.some(selection => selection.id === newCourseSelection.id)) {
        setCurrentSelections(prev => [...prev, newCourseSelection]);
      }
    }
  }

  // asynchronously calls the penn course review API with the input course
  const fetchCourse = async () => {
    try {
      let data = await getData(rootURL, courseInput);
      parseData(data, false);
    } catch (error) {
      try {
        let data = await getData(altURL, courseInput);
        parseData(data, true);
      } catch (error) {
        setCourseResult({
          id: courseInput,
          title: '',
          description: 'No Course Found',
          prerequisites: '',
          course_quality: 0,
          instructor_quality: 0,
          difficulty: 0,
          work_required: 0,
          credits: 0,
          instructor: ''
        });
        console.error('Error fetching data, course was not found in previous semester:', error);
      }
    }
  };

  // whenever the inputcourse changes, it calls fetchCourse 
  useEffect(() => {
    chrome.storage.local.get('inputcourse', (result) => {
      if (result === undefined) {
        setCourseResult({
          id: courseInput,
          title: '',
          description: 'No Course Found',
          prerequisites: '',
          course_quality: 0,
          instructor_quality: 0,
          difficulty: 0,
          work_required: 0,
          credits: 0,
          instructor: ''
        });
      } else if (result.inputcourse) {
        setCourseInput(result.inputcourse);
      }
    });
    if (courseInput) {
      fetchCourse();
    }
  }, [courseInput]);

  // Format data for recharts
  const data = [
    { name: "Course Quality", value: parseFloat(courseResult.course_quality.toFixed(1)) },
    { name: "Instructor Quality", value: parseFloat(courseResult.instructor_quality.toFixed(1)) },
    { name: "Difficulty", value: parseFloat(courseResult.difficulty.toFixed(1)) },
    { name: "Work Required", value: parseFloat(courseResult.work_required.toFixed(1)) },
  ];

  // Color function for recharts
  const getColor = (index: number, value: number) => {
    let red, green;
    const maxColorValue = 240; // Lower this value to make the colors darker

    if (index <= 1) {
      if (value <= 2) {
        red = maxColorValue;
        green = Math.round(maxColorValue * value / 2);
      } else {
        red = Math.round(maxColorValue * (4 - value) / 2);
        green = maxColorValue;
      }
    } else {
      if (value <= 2) {
        green = maxColorValue;
        red = Math.round(maxColorValue * value / 2);
      } else {
        green = Math.round(maxColorValue * (4 - value) / 2);
        red = maxColorValue;
      }
    }
    return `rgb(${red}, ${green}, 0)`;
  }

  const findCourse = async (input: string) => {
    const regex = /[^\w\s]/g;
    const entireCodeRegex = /[a-zA-z]{2,4}([-\s]|(&nbsp;))[0-9]{3,4}/;

    const match = entireCodeRegex.exec(input);

    // if a course was found, proceed to clean it
    if (match) {
      try {
        // On the first course match, replace all occurrences of any symbols with a space
        const noSymbolStringTrimmed = match[0].replace(regex, ' ').trim().toLocaleUpperCase();
        // splits by space and &nbsp; 
        const codeAndNumber = noSymbolStringTrimmed.split(/\s|&nbsp;/);

        // Check if the number part has 3 digits, and if so, append a '0'
        if (codeAndNumber[1].length === 3) {
          codeAndNumber[1] += '0';
        }

        const cleanedInputCourse = codeAndNumber[0] + '-' + codeAndNumber[1]; // Code-Number e.g CIS-1200

        const newinput = {
          inputcourse: cleanedInputCourse
        };

        chrome.storage.local.set(newinput, () => {
          console.log('Input course saved');
        });
        setCourseInput(cleanedInputCourse);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const renderItem = (number: string, name: string) => ({
    value: number,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {number}
      </div>
    ),
  });

  const history = () => {
    const classes = [];
    for (let i = 0; i < searchHistory.length; i++) {
      classes[i] = renderItem(searchHistory[i], '');
    }
    return classes;
  };

  // Handler function to update the selected option
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    const name = event.target.value;
    for (const instructorStat of courseResultProfessors) {
      if (name === instructorStat.instructor) {
        setCourseResult(instructorStat);
      }
    }
  };

  const getAutocompleteCourses = async () => {
    const response = await axios.get('https://penncoursereview.com/api/review/autocomplete');
    setCourses(response.data.courses);
  };

  useEffect(() => {
    getAutocompleteCourses();
  }, []); // this makes a call once to retrieve the courses

  const filterCourseOptions = (input: string) => {
    if (!input) {
      setOptions([]);
      return;
    }
    
    const lower = input.toLowerCase().replace(/\b([a-zA-Z]{2,4}) ([0-9]{1,4})\b/g, "$1-$2");

    // Filter courses dynamically
    const filtered = courses
      .filter((course) =>
        course.title.toLowerCase().includes(lower) ||
        course.desc.some(d => d.toLowerCase().includes(lower))
      )
      .map((course) => ({ value: `${course.title}: ${course.desc[0]}` })); // Map to { value } format for AutoComplete
    setOptions(filtered); // Update options
  };

  // Handle checkbox change for current selections
  const handleCurrentSelectionChange = (courseId: string, checked: boolean) => {
    setCurrentSelections(prev => 
      prev.map(selection => 
        selection.id === courseId 
          ? { ...selection, isChecked: checked } 
          : selection
      )
    );
  };

  // Handle checkbox change for previous selections
  const handlePreviousSelectionChange = (courseId: string, checked: boolean) => {
    setPreviousSelections(prev => {
      const updated = prev.map(selection => 
        selection.id === courseId 
          ? { ...selection, isChecked: checked } 
          : selection
      );
      
      // Save the updated selections to storage
      chrome.storage.local.set({ previousSelections: updated });
      return updated;
    });
  };

  // Save current selections to previous selections on session end or when explicitly requested
  const saveCurrentSelectionsToPrevious = () => {
    // Filter out only the checked selections to save
    const checkedSelections = currentSelections.filter(selection => selection.isChecked);
    
    if (checkedSelections.length === 0) {
      return; // Don't save if nothing is checked
    }
    
    // Merge with existing previous selections, avoiding duplicates by ID
    const newPreviousSelections = [
      ...checkedSelections,
      ...previousSelections.filter(prev => 
        !checkedSelections.some(current => current.id === prev.id)
      )
    ];
    
    setPreviousSelections(newPreviousSelections);
    chrome.storage.local.set({ previousSelections: newPreviousSelections });
    
    // Clear current selections after saving
    setCurrentSelections([]);
  };

  // Load a course from selections into the main view
  const loadCourseFromSelection = (selection: CourseSelection) => {
    // If course data is stored with the selection, use it directly
    if (selection.courseData) {
      setCourseResult(selection.courseData);
      setSelectedOption('Past Instructors Overall Average');
    } else {
      // Otherwise fetch it again
      setCourseInput(selection.id);
    }
  };

  // Remove a course from current selections
  const removeFromCurrentSelections = (courseId: string) => {
    setCurrentSelections(prev => prev.filter(selection => selection.id !== courseId));
  };

  // Remove a course from previous selections
  const removeFromPreviousSelections = (courseId: string) => {
    const updated = previousSelections.filter(selection => selection.id !== courseId);
    setPreviousSelections(updated);
    chrome.storage.local.set({ previousSelections: updated });
  };

  // Component for selections display
  const SelectionsPanel = () => (
    <div style={{ marginTop: '15px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e8e8e8', borderRadius: '5px', padding: '10px' }}>
      {/* Current Selections Section */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            padding: '5px',
            borderRadius: '3px'
          }}
          onClick={() => setShowCurrentSelections(!showCurrentSelections)}
        >
          <h4 style={{ margin: 0 }}>✓ Currently Selected ({currentSelections.length})</h4>
          <span>{showCurrentSelections ? '▼' : '►'}</span>
        </div>
        
        {showCurrentSelections && (
          <div style={{ marginBottom: '15px' }}>
            {currentSelections.length === 0 ? (
              <p style={{ color: 'gray', fontSize: '12px' }}>No courses selected in this session</p>
            ) : (
              currentSelections.map(selection => (
                <div key={selection.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Checkbox 
                    checked={selection.isChecked}
                    onChange={(e) => handleCurrentSelectionChange(selection.id, e.target.checked)}
                  />
                  <span 
                    style={{ marginLeft: '5px', cursor: 'pointer', flexGrow: 1 }}
                    onClick={() => loadCourseFromSelection(selection)}
                  >
                    <strong>{selection.id}</strong>: {selection.title}
                  </span>

                  <textarea //adding a note
                    placeholder="Add a note..."
                    defaultValue={selection.note}
                    onBlur={(e) => updateNote(selection.id, e.target.value, 'current')}
                    style={{
                      width: '100%',
                      marginTop: '5px',
                      fontSize: '12px',
                      padding: '5px',
                      borderRadius: '3px',
                      border: '1px solid #ccc',
                      resize: 'vertical'
                    }}
                  />

                  <button 
                    onClick={() => removeFromCurrentSelections(selection.id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      cursor: 'pointer',
                      color: 'red',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            {currentSelections.length > 0 && (
              <button 
                onClick={saveCurrentSelectionsToPrevious}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#3875f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginTop: '5px'
                }}
              >
                Save Checked to History
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Previous Selections Section */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            padding: '5px',
            borderRadius: '3px'
          }}
          onClick={() => setShowPreviousSelections(!showPreviousSelections)}
        >
          <h4 style={{ margin: 0 }}>📁 Previously Selected ({previousSelections.length})</h4>
          <span>{showPreviousSelections ? '▼' : '►'}</span>
        </div>
        
        {showPreviousSelections && (
          <div>
            {previousSelections.length === 0 ? (
              <p style={{ color: 'gray', fontSize: '12px' }}>No previous selections found</p>
            ) : (
              previousSelections.map(selection => (
                <div key={selection.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Checkbox 
                    checked={selection.isChecked}
                    onChange={(e) => handlePreviousSelectionChange(selection.id, e.target.checked)}
                  />
                  <span 
                    style={{ marginLeft: '5px', cursor: 'pointer', flexGrow: 1 }}
                    onClick={() => loadCourseFromSelection(selection)}
                  >
                    <strong>{selection.id}</strong>: {selection.title}
                  </span>

                  <textarea
                    placeholder="Add a note..."
                    defaultValue={selection.note}
                    onBlur={(e) => updateNote(selection.id, e.target.value, 'previous')}
                    style={{
                      width: '100%',
                      marginTop: '5px',
                      fontSize: '12px',
                      padding: '5px',
                      borderRadius: '3px',
                      border: '1px solid #ccc',
                      resize: 'vertical'
                    }}
                  />

                  <button 
                    onClick={() => removeFromPreviousSelections(selection.id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      cursor: 'pointer',
                      color: 'red',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Component for course comparison
  const CompareCoursesPanel = () => {
    // Get all checked courses from both current and previous selections
    const checkedCourses = [
      ...currentSelections.filter(c => c.isChecked),
      ...previousSelections.filter(c => c.isChecked)
    ];
    
    // Add state for toggling between table and radar views
    const [viewMode, setViewMode] = useState<'table' | 'radar'>('table');
    
    // Format data for radar chart
    const formatRadarData = () => {
      // Create the base data structure with the four metrics
      const metrics = [
        { subject: 'Course Quality', fullMark: 4 },
        { subject: 'Instructor Quality', fullMark: 4 },
        { subject: 'Difficulty', fullMark: 4 },
        { subject: 'Work Required', fullMark: 4 }
      ];
      
      // Transform the data for radar chart format
      return metrics.map(metric => {
        // Start with the base metric
        const dataPoint: any = { ...metric };
        
        // Add each course's value for this metric
        checkedCourses.forEach(course => {
          if (course.courseData) {
            switch(metric.subject) {
              case 'Course Quality':
                dataPoint[course.id] = course.courseData.course_quality || 0;
                break;
              case 'Instructor Quality':
                dataPoint[course.id] = course.courseData.instructor_quality || 0;
                break;
              case 'Difficulty':
                dataPoint[course.id] = course.courseData.difficulty || 0;
                break;
              case 'Work Required':
                dataPoint[course.id] = course.courseData.work_required || 0;
                break;
            }
          }
        });
        
        return dataPoint;
      });
    };
    
    return (
      <div style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Course Comparison</h4>
          {checkedCourses.length >= 2 && (
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'radar' : 'table')}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3875f6',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Switch to {viewMode === 'table' ? 'Radar View' : 'Table View'}
            </button>
          )}
        </div>
        
        {checkedCourses.length < 2 ? (
          <p style={{ color: 'gray', fontSize: '12px' }}>Select at least 2 courses to compare</p>
        ) : viewMode === 'table' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Course</th>
                  <th style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Course Quality</th>
                  <th style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Instructor Quality</th>
                  <th style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Difficulty</th>
                  <th style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Work Required</th>
                </tr>
              </thead>
              <tbody>
                {checkedCourses.map(course => (
                  <tr key={course.id}>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                      <strong>{course.id}</strong>
                    </td>
                    <td style={{ 
                      padding: '5px', 
                      borderBottom: '1px solid #ddd', 
                      textAlign: 'center',
                      backgroundColor: getColor(0, course.courseData?.course_quality || 0),
                      color: course.courseData?.course_quality > 2 ? '#000' : '#fff'
                    }}>
                      {course.courseData?.course_quality.toFixed(1) || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '5px', 
                      borderBottom: '1px solid #ddd', 
                      textAlign: 'center',
                      backgroundColor: getColor(1, course.courseData?.instructor_quality || 0),
                      color: course.courseData?.instructor_quality > 2 ? '#000' : '#fff'
                    }}>
                      {course.courseData?.instructor_quality.toFixed(1) || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '5px', 
                      borderBottom: '1px solid #ddd', 
                      textAlign: 'center',
                      backgroundColor: getColor(2, course.courseData?.difficulty || 0),
                      color: course.courseData?.difficulty > 2 ? '#fff' : '#000'
                    }}>
                      {course.courseData?.difficulty.toFixed(1) || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '5px', 
                      borderBottom: '1px solid #ddd', 
                      textAlign: 'center',
                      backgroundColor: getColor(3, course.courseData?.work_required || 0),
                      color: course.courseData?.work_required > 2 ? '#fff' : '#000'
                    }}>
                      {course.courseData?.work_required.toFixed(1) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ height: 300, marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={formatRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 4]} />
                
                {checkedCourses.map((course, index) => {
                  // Generate a unique color for each course
                  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <Radar
                      key={course.id}
                      name={course.id}
                      dataKey={course.id}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.6}
                    />
                  );
                })}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <img src={pennCourseSearchImage} style={{ width: '287px', height: '50px', marginBottom: '15px' }} />
      <AutoComplete
        popupClassName="certain-category-search-dropdown"
        popupMatchSelectWidth={400}
        style={{ width: 400 }}
        options={options.length == 0 ? history() : options} 
        size="large"
        onSelect={(input) => { findCourse(input) }}
        onChange={(e) => { filterCourseOptions(e) }}>
        <Input.Search size="large"
          placeholder="Find Course..."
          onSearch={(input) => { input && findCourse(input) }
          }></Input.Search>
      </AutoComplete>
      <div style={{ height: '15px' }} />
      <div style={{ marginBottom: '10px', cursor: 'pointer' }}>
      <div
        style={{
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',     
          justifyContent: 'center', 
        }}
      >
        <a
          href={`https://penncoursereview.com/course/${courseResult.id}/`}
          target="_blank"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span className='title-one'>{courseResult.id}:</span>
          <span className='title-two' style={{ marginLeft: '6px' }}>
            {courseResult.title}
          </span>
        </a>

        <button
          onClick={() =>
            navigator.clipboard.writeText(`${courseResult.id}: ${courseResult.title}`)
          }
          style={{
            marginLeft: '6px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Copy to clipboard"
        >
          <img
            src={copy}
            alt="copy"
            style={{
              width: '14px',
              height: '14px',
              objectFit: 'contain',
              opacity: 0.7,
            }}
          />
        </button>
      </div>
    </div>
      <span style={{ color: 'grey', marginBottom: '5px' }}>
        {courseResult.prerequisites}
        <span style={{ fontWeight: 'bold' }}> {`  Credits:  `} </span>
        {courseResult.credits}
        <div style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px' }}>
          {`  Instructor:  `}
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            style={{
              padding: '5px',
              fontSize: '12px',
              borderRadius: '3px',
              boxShadow: '0 0 10px 2px rgba(0,0,0,0.1)',
              color: '#444',
              backgroundColor: '#f5f5f5',
            }}
          >
            {courseResultProfessors.map(instructorStat => {
              return <option value={instructorStat.instructor}>{instructorStat.instructor}</option>
            })}
          </select>
        </div>
      </span>
      <BarChart
        width={350}
        height={150}
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide={true} domain={[0, 4]} />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          barSize={20}
          radius={[10, 10, 10, 10]}
          background={{ fill: '#eee', radius: 10 }}
        >
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#000", fontSize: 14, fontWeight: "bold" }}
          />
          {data.map((entry, index) => (
            <Cell key={`${index}`} fill={getColor(index, entry.value)} />
          ))}
        </Bar>
      </BarChart>
      <div //prereqs section
        style={{
          marginTop: 10,
          marginBottom: 10,
          fontSize: '14px',
          color: '#444',
          lineHeight: 1.4
        }}
      >
        <strong style={{ fontWeight: 600 }}>Prerequisites:</strong>{' '}
        {courseResult.prerequisites && courseResult.prerequisites.toLowerCase() !== 'none'
        ? courseResult.prerequisites
        : 'Check course description'}

      </div>
      <div>
        {isExpanded || courseResult.description.length <= maxLength
          ? courseResult.description
          : courseResult.description.slice(0, maxLength) + '...'}
      </div>
      {courseResult.description.length > maxLength && (
        <button onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginBottom: '10px',
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#3875f6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
      
      {/* New Course Selection Feature */}
      <SelectionsPanel />
      
      {/* Course Comparison Panel */}
      <CompareCoursesPanel />
      
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={clearSearchHistory}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3875f6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          Clear Search History
        </button>
        <button onClick={clearAllSelections}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          Clear All Selections
        </button>
      </div>
      
      {/* LLM Integration UI */}
      <hr style={{ width: '100%' }} />
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',          // space between rows
          justifyContent: 'center',
          width: '100%'
        }}
      >
        {/* Row 1: key input + save */}
        <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="OpenAI API Key"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <button
            onClick={saveKey}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3875f6',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Save Key
          </button>
        </div>

        {/* Row 2: GPT buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick Recommendation Button (Original) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <button
              disabled={!apiKey}
              onClick={askForSelection}
              style={{
                padding: '8px 16px',
                width: '100%',
                backgroundColor: '#3875f6',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: apiKey ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              Ask ChatGPT: Which course should I take?
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Select courses from either section for a quick, concise recommendation.
            </p>
            
            {/* Quick Recommendation Response Panel */}
            {aiSelection && (
              <div
                style={{
                  width: '95%',
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px'
                }}
              >
                <strong>Quick Recommendation:</strong>
                <p style={{ marginTop: '4px' }}>{aiSelection}</p>
              </div>
            )}
          </div>

          {/* Single Course Analysis Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '8px' }}>
            <button
              disabled={!apiKey}
              onClick={askForCourseSummary}
              style={{
                padding: '8px 16px',
                width: '100%',
                backgroundColor: '#3875f6',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: apiKey ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              Ask ChatGPT: Summarize Course
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Select exactly one course from either section to generate a detailed summary.
            </p>
            
            {/* Single Course Response Panel */}
            {singleCourseAnalysis && (
              <div
                style={{
                  width: '95%',
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px'
                }}
              >
                <strong>Course Summary:</strong>
                <div 
                  style={{ marginTop: '4px' }}
                  dangerouslySetInnerHTML={{ 
                    __html: singleCourseAnalysis
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/- (.*?)$/gm, '<div style="margin-left:10px;margin-bottom:8px;">• $1</div>')
                  }}
                />
              </div>
            )}
          </div>

          {/* Multi-Course Comparison Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '8px' }}>
            <button
              disabled={!apiKey}
              onClick={askForCourseRecommendation}
              style={{
                padding: '8px 16px',
                width: '100%',
                backgroundColor: '#3875f6',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: apiKey ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              Ask ChatGPT: Compare Courses
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Select 2 or more courses from either section for a detailed comparison.
            </p>

            {/* Multi-Course Response Panel */}
            {multiCourseRecommendation && (
              <div
                style={{
                  width: '95%',
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px'
                }}
              >
                <strong>Detailed Comparison:</strong>
                <div 
                  style={{ marginTop: '4px' }}
                  dangerouslySetInnerHTML={{ 
                    __html: multiCourseRecommendation
                      .replace(/### (.*?)$/gm, '<h4 style="margin-top:12px;margin-bottom:6px;font-size:15px">$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/- (.*?)$/gm, '<div style="margin-left:10px;margin-bottom:6px;">• $1</div>')
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <a href="https://forms.gle/qDwm7njL9JDvoHyN8" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px' }}>
          Click here to give us feedback!
        </a>
      </div>
    </div>
  );
}

export default App;